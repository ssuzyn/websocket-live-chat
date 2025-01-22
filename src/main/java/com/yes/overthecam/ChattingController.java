package com.yes.overthecam;

import com.yes.overthecam.dto.ChatMessageRequest;
import com.yes.overthecam.dto.ChatMessageResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class ChattingController {

    @MessageMapping("/chat.{roomId}") // "/chat" 주소로 발행된 메시지를
    @SendTo("/subscribe/chat.{roomId}") // "/subscribe/chat"를 구독한 사용자에게 전달
    public ChatMessageResponse sendMessage(ChatMessageRequest request, @DestinationVariable Long roomId){
        log.info(request.toString());
        return new ChatMessageResponse(request.getUsername(), request.getContent());
    }
}
