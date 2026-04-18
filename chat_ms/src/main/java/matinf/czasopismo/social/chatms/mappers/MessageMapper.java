package matinf.czasopismo.social.chatms.mappers;

import matinf.czasopismo.social.chatms.data.Message;
import matinf.czasopismo.social.chatms.model.MessagePage;

public class MessageMapper {

    public static MessagePage toMessagePage(Message message) {
        MessagePage messagePage = new MessagePage();
        messagePage.setId(message.getId());
        messagePage.setConversationId(message.getConversation().getId());
        messagePage.setSenderId(message.getSenderId());
        messagePage.setContent(message.getContent());
        messagePage.setCreatedAt(message.getCreatedAt());
        return messagePage;
    }

}
