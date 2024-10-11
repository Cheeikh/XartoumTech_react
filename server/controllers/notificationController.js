import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "firstName lastName profileUrl")
      .populate("post", "description")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des notifications",
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification non trouvée",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marquée comme lue",
      data: notification,
    });
  } catch (error) {
    console.error("Erreur lors du marquage de la notification comme lue:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du marquage de la notification comme lue",
    });
  }
};