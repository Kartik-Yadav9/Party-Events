const Event = require("../../models/EventModel");

//get all events
exports.getAllEvents = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }
    if (req.query.ticketPrice) {
        filters.ticketPrice = req.query.ticketPrice;
    }

    const events = await Event.find(filters);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get event by id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//create event(admin only)
exports.createEvent = async (req, res) => {
  const {title, description, date, location, category, totalseats, availableSeats, ticketPrice, imageurl} = req.body;
    try {
        const event = new Event({
            title,
            description,
            date,
            location,
            category,
            totalseats,
            availableSeats,
            ticketPrice,
            imageurl
        });
        // const savedEvent = await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//update event(admin only)
exports.updateEvent = async (req, res) => {
  const {title, description, date, location, category, totalseats, availableSeats, ticketPrice, imageurl} = req.body;
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, {
            title,
            description,
            date,
            location,
            category,
            totalseats,
            availableSeats,
            ticketPrice,
            imageurl
        }, { new: true });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete event(admin only)
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  
