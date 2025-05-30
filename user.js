// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCj0K9NlYXt4yVq4uQjegDh0b5aE6HnH-k",
  authDomain: "flappymird-cadb0.firebaseapp.com",
  databaseURL: "https://flappymird-cadb0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "flappymird-cadb0",
  storageBucket: "flappymird-cadb0.firebasestorage.app",
  messagingSenderId: "645077184491",
  appId: "1:645077184491:web:5535e9a5f14babb07433ae",
  measurementId: "G-X2R67H129Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

let userHighScore = 0; // Variable to store the user's high score

// Check if a user is already logged in by checking localStorage
function checkForLoggedInUser() {
  const username = localStorage.getItem('username');
  if (username) {
    displayUser(username); // Show the user's data if logged in
  } else {
    displayLoginOrRegister(); // Show options to login or register
  }
}

// Display options to login or register
function displayLoginOrRegister() {
  const userContainer = document.getElementById("user-container");
  userContainer.innerHTML = `
    <button onclick="showLogin()">Login</button>
    <button onclick="showRegister()">Register</button>
  `;
}

// Show login form
function showLogin() {
  const username = prompt("Please enter your username:").trim();
  if (username) {
    const password = prompt("Please enter your password:").trim();
    if (password) {
      loginUser(username, password); // Attempt to log in
    } else {
      alert("Password is required!");
    }
  } else {
    alert("Username is required!");
  }
}

// Show register form
function showRegister() {
    const username = prompt("Please enter your desired username:").trim();
    if (username) {
        checkIfUsernameExists(username); // Check if username exists before registration
    } else {
        alert("Username is required!");
    }
}
  
// Check if the username already exists in the database
function checkIfUsernameExists(username) {
const userRef = ref(database, 'users/' + username);
get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
    // If username exists, show an alert
    alert("Username already exists! Please choose a different username.");
    } else {
    // If username does not exist, proceed with password prompt
    const password = prompt("Please enter your password:").trim();
    if (password) {
        registerUser(username, password); // Proceed with registration if password is provided
    } else {
        alert("Password is required!");
    }
    }
}).catch((error) => {
    console.error("Error checking username:", error);
    alert("Error checking username: " + error.message);
});
}
  
// Register a new user with a username and password (plain text)
function registerUser(username, password) {

  const userRef = ref(database, 'users/' + username);
  userHighScore = 0; // Reset high score for new user
  set(userRef, {
    name: username,
    password: password,  // Plaintext password (not secure)
    score: 0
  }).then(() => {
    console.log("User registered:", username);
    localStorage.setItem('username', username);  // Save username in localStorage for session persistence
    displayUser(username); // Show user after registration
  }).catch((error) => {
    console.error("Error registering user:", error);
    alert("Error registering user: " + error.message);
  });
}

// Log in a user with username and password (plain text)
function loginUser(username, password) {
  const userRef = ref(database, 'users/' + username);
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      const user = snapshot.val();
      if (user.password === password) {
        // Password matches
        userHighScore = user.score; // Set the user's high score
        console.log("User logged in:", username);
        localStorage.setItem('username', username); // Save username in localStorage for session persistence
        displayUser(username); // Show user after login
      } else {
        alert("Incorrect password. Please try again.");
      }
    } else {
      alert("User not found. Please register first.");
    }
  }).catch((error) => {
    console.error("Error logging in:", error);
    alert("Error logging in: " + error.message);
  });
}

// Display user data and leaderboard (username and score)
function displayUser(username) {
  const userRef = ref(database, 'users/' + username);
  get(userRef).then((snapshot) => {
    const userContainer = document.getElementById("user-container");
    if (snapshot.exists()) {
      const user = snapshot.val();
      userContainer.innerHTML = `
      <h3>Leaderboard</h3>
      <div id="leaderboard"></div>
      <button onclick="logout()">Logout</button>
      `;
      displayLeaderboard(user.name); // Show the leaderboard after user logs in
    } else {
        displayLoginOrRegister();
    }
  }).catch((error) => {
    console.error("Error retrieving user data:", error);
  });
}

// Display leaderboard with all users' scores
function displayLeaderboard(currentUser) {
    const leaderboardRef = ref(database, 'users');
    get(leaderboardRef).then((snapshot) => {
      const leaderboardContainer = document.getElementById("leaderboard");
      leaderboardContainer.innerHTML = ""; // Clear the current leaderboard

      if (snapshot.exists()) {
        const users = snapshot.val();
        const sortedUsers = Object.values(users).sort((a, b) => b.score - a.score); // Sort by score
        sortedUsers.forEach(user => {
          const userElement = document.createElement("p");
          userElement.classList.add("leaderboard-entry");
          
          // Check if the user is the current logged-in user and append "(you)"
          const displayName = user.name === currentUser ? `${user.name} (you)` : user.name;
          userElement.textContent = `${displayName}: ${user.score}`;
          
          leaderboardContainer.appendChild(userElement);
        });
      } else {
        leaderboardContainer.innerHTML = "<p>No users found.</p>";
      }
    }).catch((error) => {
      console.error("Error retrieving leaderboard data:", error);
    });
  }

// Logout the current user
function logout() {
  localStorage.removeItem('username');
  userHighScore = 0; // Reset high score on logout
  checkForLoggedInUser(); // Recheck if user is logged in after logout
}

// Initialize the app and check for logged-in user
window.onload = function () {
  checkForLoggedInUser();
};

// Make the functions globally available
window.showLogin = showLogin;
window.showRegister = showRegister;
window.logout = logout;

function getHighScore() {
    return userHighScore
}

function setHighScore(newHighScore) {
    userHighScore = newHighScore; // Update the high score variable 
}

function fetchHighScore() {
    const username = localStorage.getItem('username');
    if (username) {
        const userRef = ref(database, 'users/' + username);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const user = snapshot.val();
                userHighScore = user.score; // Set the user's high score
                console.log("Fetched high score:", userHighScore);
            } else {
                console.log("User data not found.");
            }
        }).catch((error) => {
            console.error("Error fetching high score:", error);
        });
    } else {
        console.log("No user logged in.");
        highScore = 0; // Reset high score if no user is logged in
    }
}

window.getHighScore = getHighScore;
window.setHighScore = setHighScore;
window.fetchHighScore = fetchHighScore;

// user.js (Module)
function updateHighScore(newScore) { 
    const username = localStorage.getItem('username');
    if (username) {
        const userRef = ref(database, 'users/' + username);
        
        // Update the score only if the new score is higher than the current score
        get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const user = snapshot.val();
            if (newScore > user.score) {
            // Update the score in the database
            set(userRef, {
                ...user,
                score: newScore
            }).then(() => {
                console.log("User's high score updated:", newScore);
                updateLeaderboard(); // Update the leaderboard after updating the score
            }).catch((error) => {
                console.error("Error updating high score:", error);
                alert("Error updating high score: " + error.message);
            });
            } else {
            console.log("New scores is not higher than current score.");
            }
        } else {
            console.log("User data not found.");
        }
        }).catch((error) => {
        console.error("Error retrieving user data:", error);
        });
    } else {
        console.log("No user logged in.");
    }
}
  
// Make the function globally available
window.updateHighScore = updateHighScore;
  
// Refresh the leaderboard to show updated scores
function updateLeaderboard() {
    const leaderboardRef = ref(database, 'users');
    get(leaderboardRef).then((snapshot) => {
    const leaderboardContainer = document.getElementById("leaderboard");
    leaderboardContainer.innerHTML = ""; // Clear the current leaderboard

    if (snapshot.exists()) {
    const users = snapshot.val();
    const sortedUsers = Object.values(users).sort((a, b) => b.score - a.score); // Sort by score
    sortedUsers.forEach(user => {
        const userElement = document.createElement("p");
        userElement.classList.add("leaderboard-entry");
        
        // Check if the user is the current logged-in user and append "(you)"
        const displayName = user.name === localStorage.getItem('username') ? `${user.name} (you)` : user.name;
        userElement.textContent = `${displayName}: ${user.score}`;
        
        leaderboardContainer.appendChild(userElement);
    });
    } else {
    leaderboardContainer.innerHTML = "<p>No users found.</p>";
    }
}).catch((error) => {
    console.error("Error retrieving leaderboard data:", error);
});
}

// Make the leaderboard update function globally available
window.updateLeaderboard = updateLeaderboard;

  
