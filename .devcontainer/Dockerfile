# Use Node.js base image
FROM node:18

# Set the working directory
WORKDIR /workspace

# Install essential tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Expose the default React development server port
EXPOSE 3000

# Set default shell to bash
CMD ["/bin/bash"]
