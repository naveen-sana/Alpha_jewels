package com.jewellery.config;

import java.util.Map;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.WebRequest;

@Component
public class CustomErrorAttributes extends DefaultErrorAttributes {

    @Override
    public Map<String, Object> getErrorAttributes(WebRequest webRequest, ErrorAttributeOptions options) {
        Map<String, Object> errorAttributes = super.getErrorAttributes(
            webRequest, 
            options.including(
                ErrorAttributeOptions.Include.MESSAGE,
                ErrorAttributeOptions.Include.EXCEPTION,
                ErrorAttributeOptions.Include.BINDING_ERRORS,
                ErrorAttributeOptions.Include.STACK_TRACE
            )
        );
        Throwable error = getError(webRequest);
        if (error != null) {
            errorAttributes.put("exception_class", error.getClass().getName());
            errorAttributes.put("exception_message", error.getMessage());
            if (error.getCause() != null) {
                errorAttributes.put("cause_message", error.getCause().getMessage());
            }
        }
        return errorAttributes;
    }
}
