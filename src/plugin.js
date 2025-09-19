/**
 * MeshCentral Microphone Listen Plugin
 * Allows users to select and listen to microphones through web interface
 */

const path = require('path');

module.exports.pluginHandler = function(parent, domain, pluginpath, pluginname, plugindata) {
    const obj = {};
    
    // Plugin metadata
    obj.pluginname = pluginname;
    obj.pluginpath = pluginpath;
    obj.parent = parent;
    obj.domain = domain;
    
    // Plugin information
    obj.info = {
        name: "Microphone Listen Plugin",
        description: "Select and listen to microphones",
        version: "1.0.0",
        author: "MeshCentral Plugin Developer",
        homepage: "",
        changelogurl: ""
    };
    
    // Initialize plugin
    obj.init = function() {
        console.log('MeshCentral Microphone Listen Plugin initialized');
        
        // Setup web routes
        obj.setupWebRoutes();
        
        return true;
    };
    
    // Setup web routes for the plugin UI
    obj.setupWebRoutes = function() {
        const webPath = path.join(obj.pluginpath, 'web');
        
        // Serve static files from web directory
        obj.parent.app.use(`/plugins/${obj.pluginname}`, obj.parent.express.static(webPath));
        
        // Main plugin route
        obj.parent.app.get(`/plugins/${obj.pluginname}/main`, function(req, res) {
            if (!req.session || !req.session.userid) {
                res.redirect('/login');
                return;
            }
            
            // Serve the main plugin page
            res.sendFile(path.join(webPath, 'index.html'));
        });
        
        console.log(`Plugin web interface available at: /plugins/${obj.pluginname}/main`);
    };
    
    // Plugin cleanup
    obj.close = function() {
        console.log('MeshCentral Microphone Listen Plugin closed');
    };
    
    // Plugin hook handlers
    obj.hooks = {
        'serverStarted': obj.init
    };
    
    return obj;
};