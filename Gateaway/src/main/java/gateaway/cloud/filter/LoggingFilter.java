package gateaway.cloud.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class LoggingFilter implements Filter {

    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        logger.info("🌐 Gateway Request: {} {}", 
            httpRequest.getMethod(), 
            httpRequest.getRequestURI());
        
        long startTime = System.currentTimeMillis();
        
        chain.doFilter(request, response);
        
        long duration = System.currentTimeMillis() - startTime;
        
        logger.info("✅ Gateway Response: {} - {}ms", 
            httpRequest.getRequestURI(), 
            duration);
    }
}
