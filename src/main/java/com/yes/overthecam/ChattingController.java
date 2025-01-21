package com.yes.overthecam;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Slf4j
@Controller
public class ChattingController {

    @MessageMapping("/hello") // 메시지가 대상 "/hello"에 전송되면 해당 메서드가 호출되도록 보장
    @SendTo("/topic/greetings") // 모든 구독자에게 브로드 캐스트
    public Greeting greeting(HelloMessage message) throws Exception{
        log.info(message.toString());
        Thread.sleep(1000); // simulated delay
        return new Greeting("안녕하세요, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }
}
