//User Authentication System start
/*====================================================================*/


// User model (simplified)
const User = function(username, email, password) {
    this.username = username;
    this.email = email;
    // In a real application, password would be hashed before storing
    this.password = password;
  };
  
  // In-memory user data (replace with database interaction)
  const users = [];
  
  // Registration function (simulated)
  function register(username, email, password) {
    const newUser = new User(username, email, password);
    users.push(newUser);
    console.log("User registered successfully!");
  }
  
  // Login function (simulated, no password hashing)
  function login(usernameOrEmail, password) {
    for (const user of users) {
      if ((user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password) {
        console.log("Login successful for user:", user.username);
        // In a real application, establish a session here
        return true;
      }
    }
    console.log("Invalid login credentials!");
    return false;
  }
  
  // Example usage
  register("johnDoe", "john.doe@example.com", "password123");
  register("janeSmith", "jane.smith@example.com", "secretPassword");
  
  const loginSuccess = login("johnDoe", "password123");
  if (loginSuccess) {
    console.log("Welcome back, John Doe!");
    // Display user-specific content or functionalities
  } else {
    console.log("Login failed! Please try again.");
  }


/*====================================================================*/
  //User Authentication System end



  //Feature Identification start
/*====================================================================*/



  function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    // Send login data (username & password) to the backend using AJAX or Fetch API
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Login successful, store user information or redirect to a secure user area
        console.log("Login successful!");
      } else {
        // Login failed, display an error message
        console.error("Invalid login credentials!");
      }
    })
    .catch(error => {
      console.error("Error during login:", error);
    });
  }
  

/*====================================================================*/
  //Feature Identification End


  //Object-Oriented Design Start
/*====================================================================*/
  //Event Class start
/*====================================================================*/


  class Event {
    constructor(id, title, date, time, organizer, venue, category, description) {
      this.id = id;
      this.title = title;
      this.date = date;
      this.time = time;
      this.organizer = organizer;
      this.venue = venue;
      this.category = category;
      this.description = description;
      this.tickets = []; // Array to hold available ticket types
    }
  
    // Add methods for event details retrieval, ticket addition/removal, etc.
    getDetails() {
      return `Title: ${this.title}\nDate: ${this.date} | Time: ${this.time}\nOrganizer: ${this.organizer}\nVenue: ${this.venue}`;
    }
  
    addTicketType(ticketType) {
      this.tickets.push(ticketType);
    }
  
    removeTicketType(ticketType) {
      // Implement logic to remove ticket type based on specific criteria (e.g., ID)
    }
  }

  
/*====================================================================*/
//Event Class end

//Ticket Class start
/*====================================================================*/

class Ticket {
    constructor(id, type, price, quantity) {
      this.id = id;
      this.type = type; // e.g., "General Admission", "VIP"
      this.price = price;
      this.quantity = quantity;
    }
  
    // Add methods for ticket details retrieval, purchase handling (reduce quantity)
    getDetails() {
      return `Type: ${this.type} | Price: ${this.price} | Quantity Available: ${this.quantity}`;
    }
  
    purchase(numTickets) {
      if (numTickets <= this.quantity) {
        this.quantity -= numTickets;
        return true; // Purchase successful
      } else {
        return false; // Insufficient ticket quantity
      }
    }
  }


  /*====================================================================*/
  //ticket class end

  //User Class start (Errors)
/*====================================================================*/

  class User {
    constructor(id, username, email) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.purchasedTickets = []; // Array to hold purchased tickets (references to Ticket objects)
    }
  
    // Add methods for user profile management, purchased ticket history access, etc.
    getProfileDetails() {
      return `Username: ${this.username} | Email: ${this.email}`;
    }
  
    addPurchasedTicket(ticket) {
      this.purchasedTickets.push(ticket);
    }
  }


  /*====================================================================*/
  //user class end

/*====================================================================*/
  //Object-Oriented Design end

  //event listing start
/*====================================================================*/

  // Function to fetch events from the backend
function fetchEvents(filter = "upcoming") {
    const url = `/api/events?filter=${filter}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        displayEvents(data);
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        // You can display an error message to the user here
      });
  }
  
  // Function to display events in a sorted list
  function displayEvents(events) {
    // Sort events by date (latest first)
    events.sort((event1, event2) => {
      const date1 = new Date(event1.date);
      const date2 = new Date(event2.date);
      return date2.getTime() - date1.getTime(); // Descending order
    });
  
    const eventList = document.getElementById("event-list");
    eventList.innerHTML = ""; // Clear previous list
  
    events.forEach(event => {
      const eventItem = document.createElement("li");
      eventItem.innerHTML = `<h3>${event.title}</h3>
                               <p>Date: ${event.date} | Time: ${event.time}</p>
                               <p>Venue: ${event.venue}</p>`;
      // Add event details page link or button (optional)
      eventList.appendChild(eventItem);
    });
  }
  
  // Example usage (call this function when needed)
  fetchEvents(); // Fetch upcoming events by default
  // Alternatively, you can call fetchEvents("all") to fetch all events

  
  //event listing end

  //Ticket Selection and Booking Process start

  /* example-(HTML) 
  =================================>
  
  <div id="event-details">
  <h2>Event Details</h2>
  <p>Title: <span id="event-title"></span></p>
  <p>Date: <span id="event-date"></span> | Time: <span id="event-time"></span></p>
  <p>Venue: <span id="event-venue"></span></p>
  <img id="event-image" src="" alt="Event Image">
  <p>Description: <span id="event-description"></span></p>
  
  <h3>Available Tickets</h3>
  <select id="ticket-type">
    </select>
  <label for="quantity">Quantity:</label>
  <input type="number" id="ticket-quantity" min="1" value="1">
  <p id="ticket-price"></p>
  <button id="book-tickets">Book Tickets</button>
</div>

<==================================
*/

// Function to populate event details and ticket selection options
function displayEventDetails(event) {
    document.getElementById("event-title").textContent = event.title;
    // ... (set other event details elements using event properties)
    
    const ticketSelect = document.getElementById("ticket-type");
    ticketSelect.innerHTML = ""; // Clear existing options
    
    event.tickets.forEach(ticket => {
      const option = document.createElement("option");
      option.value = ticket.id; // Store ticket ID in the option value
      option.textContent = `${ticket.type} - Price: $${ticket.price}`;
      ticketSelect.appendChild(option);
    });
    
    updateTicketPrice(); // Function to update total price based on selection (see below)
  }
  
  // Function to update total price based on selected ticket and quantity
  function updateTicketPrice() {
    const selectedTicketId = document.getElementById("ticket-type").value;
    const ticketQuantity = parseInt(document.getElementById("ticket-quantity").value);
    
    // Find the selected ticket object based on ID (backend interaction might be needed)
    const selectedTicket = event.tickets.find(ticket => ticket.id === selectedTicketId);
    
    if (selectedTicket) {
      const totalPrice = ticketQuantity * selectedTicket.price;
      document.getElementById("ticket-price").textContent = `Total: $${totalPrice.toFixed(2)}`;
    } else {
      // Handle cases where the selected ticket is no longer available
      console.error("Selected ticket not found!");
    }
  }
  
  // Event listener for ticket selection change (update price)
  document.getElementById("ticket-type").addEventListener("change", updateTicketPrice);
  
  // Event listener for book tickets button (redirect to secure checkout)
  document.getElementById("book-tickets").addEventListener("click", function() {
    // Implement logic to send booking information to the backend for processing
    // This might involve user login information and payment integration
    console.log("Booking tickets...");
    // Redirect to secure payment gateway (replace with actual URL)
    window.location.href = "URL";
  });
  

  /*====================================================================*/
 //Ticket Selection and Booking Process end
