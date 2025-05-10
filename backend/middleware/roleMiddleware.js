module.exports = (requiredRoles) => {
    // Convert single role to array for consistent handling
    if (!Array.isArray(requiredRoles)) {
        requiredRoles = [requiredRoles];
    }
    
    return (req, res, next) => {
        // Check if user exists and has a role
        if (!req.user || !req.user.role_name) {
            return res.status(401).send('Authentication required');
        }
        
        // Check if user's role is in the required roles array
        if (!requiredRoles.includes(req.user.role_name)) {
            return res.status(403).send('Access denied');
        }
        
        next();
    };
};
