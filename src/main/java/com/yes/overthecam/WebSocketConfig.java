package com.yes.overthecam;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // 메시지 브로커가 지원하는 WebSocket 메시지 처리를 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){
        config.enableSimpleBroker("/subscribe"); // 구독 주소의 prefix를 지정
        config.setApplicationDestinationPrefixes("/publish"); // 메시지 발행 주소의 prefixfmf 지정
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-connect") // 초기 핸드셰이크 과정에서 사용할 endpoint 지정
            .setAllowedOrigins("*"); // CORS 허용 설정
    }
}
