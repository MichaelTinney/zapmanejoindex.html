const apiBase = '/api'; // Base URL for API calls
let token = localStorage.getItem('jwt'); // Retrieve JWT from localStorage after login

// Handle tab navigation
$('.nav-link').on('click', function(e) {
  e.preventDefault();
  const target = $(this).attr('href');
  $('.tab-pane').removeClass('active');
  $(target).addClass('active');
});

// Load WhatsApp message logs for WhatsApp Hub tab
function loadMessageLogs(page = 1) {
  $.ajax({
    url: `${apiBase}/parse-logs?page=${page}&limit=10`,
    headers: { Authorization: `Bearer ${token}` },
    success: function(data) {
      const tbody = $('#message-logs tbody');
      tbody.empty();
      data.docs.forEach(log => {
        tbody.append(`
          <tr>
            <td>${new Date(log.timestamp).toLocaleString()}</td>
            <td>${log.senderName}</td>
            <td>${log.message}</td>
            <td>${log.parsed.action || 'N/A'}</td>
          </tr>
        `);
      });
      // TODO: Add pagination controls if needed
    },
    error: function() {
      alert('Error loading message logs');
    }
  });
}

// Search messages in WhatsApp Hub
$('#search-messages').on('input', function() {
  const search = $(this).val();
  // TODO: Implement client-side filtering or add search query to API call
});

// Load analytics chart for Analytics tab
function loadAnalytics() {
  $.ajax({
    url: `${apiBase}/analytics`,
    headers: { Authorization: `Bearer ${token}` },
    success: function(data) {
      const ctx = $('#trends-chart')[0].getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Example labels
          datasets: [{
            label: 'Cattle Trends',
            data: data.trends || [12, 19, 3, 5, 2, 3], // Replace with real data
            borderColor: '#007bff',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    },
    error: function() {
      alert('Error loading analytics');
    }
  });
}

// Milk production form submission for Milk Production tab
$('#milk-form').on('submit', function(e) {
  e.preventDefault();
  const data = {
    tag: $('#buffalo-tag').val(),
    amount: $('#milk-amount').val(),
    date: $('#date').val(),
  };
  $.ajax({
    url: `${apiBase}/milk-production`,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function() {
      alert('Milk data submitted successfully');
      loadMilkLogs();
    },
    error: function() {
      alert('Error submitting milk data');
    }
  });
});

// Load milk production logs
function loadMilkLogs() {
  $.ajax({
    url: `${apiBase}/milk-production`,
    headers: { Authorization: `Bearer ${token}` },
    success: function(data) {
      const tbody = $('#milk-logs tbody');
      tbody.empty();
      data.forEach(log => {
        tbody.append(`
          <tr>
            <td>${new Date(log.date).toLocaleDateString()}</td>
            <td>${log.tag}</td>
            <td>${log.amount} liters</td>
          </tr>
        `);
      });
    },
    error: function() {
      alert('Error loading milk logs');
    }
  });
}

// Initial loads
loadMessageLogs();
loadAnalytics();
loadMilkLogs();
