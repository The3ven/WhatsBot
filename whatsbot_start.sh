#!/bin/bash


base_path="/home/FireArch/WhatsBot"
# Log file path
log_file="${base_path}/Whatsbot_$(date +'%Y-%m-%d_%H-%M-%S').log"

# Function to check internet connectivity
isInternetConnected() {
    ping -c 1 google.com > /dev/null 2>&1
}

# Function to wait for internet connectivity
waitForInternet() {
    while ! isInternetConnected; do
        echo "Waiting for internet connectivity..." | tee -a "$log_file"
        sleep 60s
    done
}

# Main script logic
main() {
    cd ${base_path}
    waitForInternet
    # Run Node.js script and capture logs
    /usr/bin/node startProcess.js 2>&1 | tee -a "$log_file"
}

# Run the main function
main
