#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

/**
 * Kill process running on the specified port
 * @param {number} port - Port number to free up
 */
function killPort(port) {
  if (!port || isNaN(port)) {
    console.error('Error: Please provide a valid port number');
    console.log('Usage: node scripts/kill-port.js <port>');
    process.exit(1);
  }

  const platform = os.platform();

  try {
    if (platform === 'win32') {
      // Windows
      console.log(`Looking for process on port ${port}...`);

      try {
        // Find process using the port
        const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });

        // Extract PIDs from the output
        const lines = result.split('\n').filter(line => line.trim());
        const pids = new Set();

        lines.forEach(line => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && !isNaN(pid)) {
            pids.add(pid);
          }
        });

        if (pids.size === 0) {
          console.log(`No process found on port ${port}`);
          return;
        }

        // Kill each process
        pids.forEach(pid => {
          try {
            execSync(`taskkill /PID ${pid} /F`, { encoding: 'utf8' });
            console.log(`Killed process ${pid} on port ${port}`);
          } catch (err) {
            console.error(`Failed to kill process ${pid}:`, err.message);
          }
        });

        console.log(`Port ${port} is now free`);
      } catch (err) {
        if (err.message.includes('File not found')) {
          console.log(`No process found on port ${port}`);
        } else {
          throw err;
        }
      }
    } else {
      // Unix-based (Linux, macOS)
      console.log(`Looking for process on port ${port}...`);

      try {
        const result = execSync(`lsof -ti :${port}`, { encoding: 'utf8' });
        const pids = result.trim().split('\n').filter(pid => pid);

        if (pids.length === 0) {
          console.log(`No process found on port ${port}`);
          return;
        }

        pids.forEach(pid => {
          execSync(`kill -9 ${pid}`);
          console.log(`Killed process ${pid} on port ${port}`);
        });

        console.log(`Port ${port} is now free`);
      } catch (err) {
        if (err.status === 1) {
          console.log(`No process found on port ${port}`);
        } else {
          throw err;
        }
      }
    }
  } catch (error) {
    console.error(`Error killing process on port ${port}:`, error.message);
    process.exit(1);
  }
}

// Get port from command line arguments
const port = parseInt(process.argv[2], 10);
killPort(port);
