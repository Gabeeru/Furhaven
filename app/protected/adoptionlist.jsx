import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

export default function AdoptionListScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAdoptionRequests();
  }, []);

  const fetchAdoptionRequests = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert("Error", "Please login first");
        router.replace("/auth/login");
        return;
      }

      // First, get all pets owned by this user
      const petsQuery = query(
        collection(db, "pets"),
        where("ownerId", "==", user.uid)
      );
      const petsSnapshot = await getDocs(petsQuery);
      const petIds = petsSnapshot.docs.map((doc) => doc.id);

      if (petIds.length === 0) {
        setRequests([]);
        setLoading(false);
        return;
      }

      // Get all adoption requests for these pets
      const requestsQuery = query(
        collection(db, "adoptionRequests"),
        where("petId", "in", petIds)
      );
      const requestsSnapshot = await getDocs(requestsQuery);

      const requestsData = requestsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

      setRequests(requestsData);
    } catch (error) {
      console.error("Error fetching adoption requests:", error);
      Alert.alert("Error", "Failed to load adoption requests");
    } finally {
      setLoading(false);
    }
  };

  // Check if a pet already has an approved request
  const isPetAlreadyAdopted = async (petId) => {
    try {
      const petRef = doc(db, "pets", petId);
      const petDoc = await getDoc(petRef);
      if (petDoc.exists()) {
        const petData = petDoc.data();
        return petData.status === "Adopted";
      }
      return false;
    } catch (error) {
      console.error("Error checking pet status:", error);
      return false;
    }
  };

  const handleApproveRequest = async (request) => {
    // First, check if pet is already adopted
    const isAdopted = await isPetAlreadyAdopted(request.petId);
    
    if (isAdopted) {
      Alert.alert(
        "Already Adopted",
        `This pet has already been adopted by someone else. You cannot approve another adopter.`
      );
      await fetchAdoptionRequests(); // Refresh the list
      return;
    }

    Alert.alert(
      "Approve Adoption",
      `Are you sure you want to approve ${request.adopterName} to adopt ${request.petName}?\n\nThis will mark the pet as ADOPTED and all other requests will be automatically rejected.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              setProcessing(true);

              // 1. Update the approved adoption request status to "Approved"
              const requestRef = doc(db, "adoptionRequests", request.id);
              await updateDoc(requestRef, {
                status: "Approved",
                updatedAt: new Date(),
              });

              // 2. Update pet status to "Adopted"
              const petRef = doc(db, "pets", request.petId);
              await updateDoc(petRef, {
                status: "Adopted",
                adoptedBy: request.adopterId,
                adoptedByName: request.adopterName,
                adoptedAt: new Date(),
                updatedAt: new Date(),
              });

              // 3. Reject ALL other pending requests for this pet
              const otherRequests = requests.filter(
                (r) => r.petId === request.petId && r.id !== request.id && r.status === "Pending"
              );

              for (const otherRequest of otherRequests) {
                const otherRequestRef = doc(db, "adoptionRequests", otherRequest.id);
                await updateDoc(otherRequestRef, {
                  status: "Rejected",
                  updatedAt: new Date(),
                });
              }

              Alert.alert(
                "Success",
                `${request.petName} has been adopted by ${request.adopterName}! All other requests have been rejected.`
              );

              // Refresh the list
              await fetchAdoptionRequests();
            } catch (error) {
              console.error("Error approving request:", error);
              Alert.alert("Error", "Failed to approve adoption request");
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleRejectRequest = async (request) => {
    // Check if pet is already adopted before rejecting
    const isAdopted = await isPetAlreadyAdopted(request.petId);
    
    if (isAdopted) {
      Alert.alert(
        "Pet Already Adopted",
        `This pet has already been adopted. This request will be rejected.`,
        [
          {
            text: "OK",
            onPress: async () => {
              try {
                setProcessing(true);
                const requestRef = doc(db, "adoptionRequests", request.id);
                await updateDoc(requestRef, {
                  status: "Rejected",
                  updatedAt: new Date(),
                });
                await fetchAdoptionRequests();
              } catch (error) {
                console.error("Error:", error);
              } finally {
                setProcessing(false);
              }
            },
          },
        ]
      );
      return;
    }

    Alert.alert(
      "Reject Request",
      `Are you sure you want to reject ${request.adopterName}'s adoption request for ${request.petName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessing(true);
              const requestRef = doc(db, "adoptionRequests", request.id);
              await updateDoc(requestRef, {
                status: "Rejected",
                updatedAt: new Date(),
              });

              Alert.alert("Success", "Adoption request rejected");
              await fetchAdoptionRequests();
            } catch (error) {
              console.error("Error rejecting request:", error);
              Alert.alert("Error", "Failed to reject request");
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Approved":
        return { backgroundColor: "#4CAF50", text: "Approved" };
      case "Rejected":
        return { backgroundColor: "#f44336", text: "Rejected" };
      default:
        return { backgroundColor: "#FF9800", text: "Pending" };
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "Unknown date";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Group requests by pet for better visualization
  const groupRequestsByPet = () => {
    const grouped = {};
    requests.forEach(request => {
      if (!grouped[request.petId]) {
        grouped[request.petId] = {
          petName: request.petName,
          requests: []
        };
      }
      grouped[request.petId].requests.push(request);
    });
    return grouped;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#B07D5E" />
        <Text style={{ marginTop: 10 }}>Loading requests...</Text>
      </View>
    );
  }

  const groupedRequests = groupRequestsByPet();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with title on left and refresh on right */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adoption Requests</Text>
        <TouchableOpacity onPress={fetchAdoptionRequests} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#B07D5E" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={80} color="#D9C4A9" />
            <Text style={styles.emptyTitle}>No Adoption Requests</Text>
            <Text style={styles.emptyText}>
              When someone requests to adopt your pet, it will appear here.
            </Text>
          </View>
        ) : (
          <>
            {Object.values(groupedRequests).map((group) => (
              <View key={group.petName} style={styles.petGroup}>
                <Text style={styles.petGroupTitle}>{group.petName}</Text>
                {group.requests.map((request) => {
                  const statusStyle = getStatusBadgeStyle(request.status);
                  return (
                    <View key={request.id} style={styles.requestCard}>
                      <View style={styles.cardHeader}>
                        <View>
                          <Text style={styles.adopterName}>
                            {request.adopterName}
                          </Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                          <Text style={styles.statusText}>{statusStyle.text}</Text>
                        </View>
                      </View>

                      <View style={styles.requestDetails}>
                        <View style={styles.detailRow}>
                          <Ionicons name="call-outline" size={16} color="#7A6B5D" />
                          <Text style={styles.detailText}>{request.adopterPhone}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Ionicons name="mail-outline" size={16} color="#7A6B5D" />
                          <Text style={styles.detailText}>{request.adopterEmail}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Ionicons name="location-outline" size={16} color="#7A6B5D" />
                          <Text style={styles.detailText}>{request.adopterAddress}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Ionicons name="calendar-outline" size={16} color="#7A6B5D" />
                          <Text style={styles.detailText}>Submitted: {formatDate(request.createdAt)}</Text>
                        </View>
                      </View>

                      {request.status === "Pending" && (
                        <View style={styles.actionButtons}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.approveButton]}
                            onPress={() => handleApproveRequest(request)}
                            disabled={processing}
                          >
                            <Ionicons name="checkmark" size={20} color="#FFF" />
                            <Text style={styles.actionButtonText}>Approve</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => handleRejectRequest(request)}
                            disabled={processing}
                          >
                            <Ionicons name="close" size={20} color="#FFF" />
                            <Text style={styles.actionButtonText}>Reject</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF2E3",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDF2E3",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#332115",
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#332115",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#7A6B5D",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 40,
  },
  petGroup: {
    marginBottom: 24,
  },
  petGroupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#332115",
    marginBottom: 12,
    paddingLeft: 4,
  },
  requestCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  adopterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#332115",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFF",
  },
  requestDetails: {
    borderTopWidth: 1,
    borderTopColor: "#E8DCC8",
    paddingTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#7A6B5D",
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#f44336",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
});