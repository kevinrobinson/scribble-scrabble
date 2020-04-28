// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

// https redirect
export function enforceHTTPS(request, response, next) {
  const isProduction = (process.env.NODE_ENV === 'production');
  const isHTTPS = (request.headers['x-forwarded-proto'] === 'https');
  if (isProduction && !isHTTPS) {
    const httpsUrl = ['https://', request.headers.host, request.url].join('');
    return response.redirect(httpsUrl);  
  }

  return next();
}
