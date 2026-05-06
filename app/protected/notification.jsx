import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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
} from "firebase/firestore";

export default function NotificationScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        Alert.alert("Error", "Please login first");
        router.replace("/auth/login");
        return;
      }

      let allNotifications = [];

      // 1. Get all pets owned by this user (for owner notifications)
      const petsQuery = query(
        collection(db, "pets"),
        where("ownerId", "==", user.uid)
      );
      const petsSnapshot = await getDocs(petsQuery);
      const petIds = petsSnapshot.docs.map((doc) => doc.id);

      // 2. Get adoption requests for owner's pets (Owner receives these)
      if (petIds.length > 0) {
        // Remove orderBy to avoid index requirement
        const requestsQuery = query(
          collection(db, "adoptionRequests"),
          where("petId", "in", petIds)
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        
        const requestNotifications = requestsSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "adoption_request",
          ...doc.data(),
          read: doc.data().readOwner || false,
          createdAt: doc.data().createdAt,
          forUser: "owner",
        }));
        
        allNotifications = [...allNotifications, ...requestNotifications];
      }

      // 3. Get adoption requests submitted by the user (Adopter receives these)
      const myRequestsQuery = query(
        collection(db, "adoptionRequests"),
        where("adopterId", "==", user.uid)
      );
      const myRequestsSnapshot = await getDocs(myRequestsQuery);
      
      const myRequestNotifications = myRequestsSnapshot.docs.map((doc) => {
        const data = doc.data();
        let notificationType = "adopter_request_status";
        let message = "";
        
        if (data.status === "Approved") {
          notificationType = "request_approved";
          message = `Your adoption request for ${data.petName} has been APPROVED! 🎉`;
        } else if (data.status === "Rejected") {
          notificationType = "request_rejected";
          message = `Your adoption request for ${data.petName} has been rejected.`;
        } else {
          message = `You submitted an adoption request for ${data.petName}. Waiting for owner approval.`;
        }
        
        return {
          id: doc.id,
          type: notificationType,
          ...data,
          customMessage: message,
          read: data.readAdopter || false,
          createdAt: data.createdAt,
          forUser: "adopter",
          updatedAt: data.updatedAt,
        };
      });
      
      allNotifications = [...allNotifications, ...myRequestNotifications];

      // 4. Get pet status updates (when user's pet gets adopted)
      if (petIds.length > 0) {
        const petsWithUpdates = petsSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.status === "Adopted" && data.adoptedAt;
        });
        
        const petUpdateNotifications = petsWithUpdates.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id + "_adopted",
            type: "pet_adopted",
            petId: doc.id,
            petName: data.name,
            adoptedByName: data.adoptedByName,
            status: "Adopted",
            read: false,
            createdAt: data.adoptedAt,
            forUser: "owner",
            customMessage: `${data.name} has been adopted by ${data.adoptedByName || "someone"}! 🐾`,
          };
        });
        
        allNotifications = [...allNotifications, ...petUpdateNotifications];
      }

      // Sort all notifications by date manually (newest first)
      allNotifications.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      setNotifications(allNotifications);
      
      // Count unread notifications
      const unread = allNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notification) => {
    try {
      // Update read status in Firestore based on notification type
      if (notification.type === "adoption_request" || notification.type === "adopter_request_status") {
        const notificationRef = doc(db, "adoptionRequests", notification.id);
        
        if (notification.forUser === "owner") {
          await updateDoc(notificationRef, {
            readOwner: true,
          });
        } else if (notification.forUser === "adopter") {
          await updateDoc(notificationRef, {
            readAdopter: true,
          });
        }
      }
      
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notification.id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleNotificationPress = async (notification) => {
    await markAsRead(notification);
    
    // Navigate based on notification type
    if (notification.type === "adoption_request" || notification.type === "adopter_request_status") {
      router.push({
        pathname: "/protected/adoptionlist",
        params: { petId: notification.petId, petName: notification.petName }
      });
    } else if (notification.type === "pet_adopted") {
      router.push({
        pathname: "/protected/mypet",
      });
    } else {
      router.push({
        pathname: "/protected/adoptionlist",
        params: { petId: notification.petId, petName: notification.petName }
      });
    }
  };

  const getNotificationIcon = (notification) => {
    switch (notification.type) {
      case "adoption_request":
        return "person-add-outline";
      case "request_approved":
        return "checkmark-circle-outline";
      case "request_rejected":
        return "close-circle-outline";
      case "pet_adopted":
        return "heart-circle-outline";
      default:
        return "notifications-outline";
    }
  };

  const getNotificationColor = (notification) => {
    switch (notification.type) {
      case "adoption_request":
        return "#FF9800";
      case "request_approved":
        return "#4CAF50";
      case "request_rejected":
        return "#f44336";
      case "pet_adopted":
        return "#9C27B0";
      default:
        return "#B07D5E";
    }
  };

  const getNotificationMessage = (notification) => {
    if (notification.customMessage) {
      return notification.customMessage;
    }
    
    switch (notification.type) {
      case "adoption_request":
        return `${notification.adopterName} requested to adopt ${notification.petName}`;
      case "request_approved":
        return `🎉 Great news! Your adoption request for ${notification.petName} has been APPROVED!`;
      case "request_rejected":
        return `Your adoption request for ${notification.petName} has been rejected.`;
      case "pet_adopted":
        return notification.customMessage || `${notification.petName} has found a forever home! 🐾`;
      default:
        return `New update for ${notification.petName}`;
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return "Just now";
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    if (diffDays < 7) return `${diffDays} day ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#B07D5E" />
        <Text style={{ marginTop: 10 }}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
        <TouchableOpacity onPress={fetchAllNotifications} style={styles.refreshButton}>
          <Ionicons name="refresh" size={22} color="#B07D5E" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={80} color="#D9C4A9" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyText}>
              When you receive adoption requests or updates, they will appear here.
            </Text>
          </View>
        ) : (
          notifications.map((notification, index) => (
            <TouchableOpacity
              key={`${notification.id}_${index}`}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.notificationIcon}>
                <View style={[styles.iconCircle, { backgroundColor: getNotificationColor(notification) }]}>
                  <Ionicons
                    name={getNotificationIcon(notification)}
                    size={24}
                    color="#FFF"
                  />
                </View>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationMessage}>
                  {getNotificationMessage(notification)}
                </Text>
                <Text style={styles.notificationTime}>
                  {formatTime(notification.createdAt)}
                </Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    color: "#332115",
  },
  badge: {
    backgroundColor: "#FF9800",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginRight: 8,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
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
    paddingVertical: 80,
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
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  unreadCard: {
    backgroundColor: "#FFF9F0",
    borderLeftWidth: 3,
    borderLeftColor: "#B07D5E",
  },
  notificationIcon: {
    marginRight: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    fontWeight: "500",
    color: "#332115",
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 11,
    color: "#7A6B5D",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#B07D5E",
    marginLeft: 8,
  },
});