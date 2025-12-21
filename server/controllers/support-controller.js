const SupportTicket = require("../models/SupportTicket");

const createTicket = async (req, res) => {
  try {
    const { userId, userName, userEmail, title, description, priority } = req.body;
    const ticket = new SupportTicket({
      userId,
      userName,
      userEmail,
      title,
      description,
      priority,
    });
    await ticket.save();
    res.status(201).json({ success: true, message: "Ticket created successfully", data: ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating ticket" });
  }
};

const getTickets = async (req, res) => {
  try {
    const { userId, role } = req.query;
    let query = {};
    
    // If student, only see own tickets
    if (role === 'student') {
        query.userId = userId;
    }
    // Admins/Instructors see all (can refine later)

    const tickets = await SupportTicket.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching tickets" });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const ticket = await SupportTicket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.status(200).json({ success: true, message: "Ticket updated", data: ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating ticket" });
  }
};

const addReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { senderId, senderName, role, message } = req.body;

        const ticket = await SupportTicket.findById(id);
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        ticket.responses.push({
            senderId,
            senderName,
            role,
            message,
        });

        await ticket.save();
        res.status(200).json({ success: true, message: "Reply added", data: ticket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding reply" });
    }
}

module.exports = { createTicket, getTickets, updateTicketStatus, addReply };
