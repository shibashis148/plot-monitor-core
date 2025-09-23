# Production stage - using pre-built frontend from CI/CD
FROM nginx:alpine

# Copy pre-built app to nginx
COPY build/ /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
