package com.projet.molarisse.message;

import com.projet.molarisse.message.dto.ConversationDTO;
import com.projet.molarisse.message.dto.MessageDTO;
import com.projet.molarisse.message.dto.SendMessageRequest;
import com.projet.molarisse.security.JwtService;
import com.projet.molarisse.user.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    
    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);
    
    private final MessageService messageService;
    private final MessageMapper messageMapper;
    
    /**
     * Send a message to another user
     */
    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        Integer senderId = currentUser.getId();
        
        logger.info("User {} is sending message to user {}", senderId, request.getRecipientId());
        
        Message message = messageService.sendMessage(
                senderId,
                request.getRecipientId(),
                request.getContent());
        
        return ResponseEntity.ok(messageMapper.toDTO(message, senderId));
    }
    
    /**
     * Get conversation with another user
     */
    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<MessageDTO>> getConversation(
            @PathVariable Integer userId,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        Integer currentUserId = currentUser.getId();
        
        logger.info("Fetching conversation between users {} and {}", currentUserId, userId);
        
        List<Message> messages = messageService.getConversation(currentUserId, userId);
        List<MessageDTO> messageDTOs = messages.stream()
                .map(message -> messageMapper.toDTO(message, currentUserId))
                .collect(Collectors.toList());
        
        // Mark all messages from the other user as read
        messageService.markConversationAsRead(currentUserId, userId);
        
        return ResponseEntity.ok(messageDTOs);
    }
    
    /**
     * Get paginated conversation with another user
     */
    @GetMapping("/conversations/{userId}/paged")
    public ResponseEntity<Page<MessageDTO>> getConversationPaged(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        Integer currentUserId = currentUser.getId();
        
        logger.info("Fetching paginated conversation between users {} and {}", currentUserId, userId);
        
        Page<Message> messages = messageService.getConversationPaged(currentUserId, userId, page, size);
        Page<MessageDTO> messageDTOs = messages.map(message -> messageMapper.toDTO(message, currentUserId));
        
        // Mark all messages from the other user as read
        messageService.markConversationAsRead(currentUserId, userId);
        
        return ResponseEntity.ok(messageDTOs);
    }
    
    /**
     * Get all conversations for the current user
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        Integer currentUserId = currentUser.getId();
        
        logger.info("Fetching all conversations for user {}", currentUserId);
        
        List<Map<String, Object>> conversations = messageService.getConversations(currentUserId);
        List<ConversationDTO> conversationDTOs = conversations.stream()
                .map(conversationData -> messageMapper.toConversationDTO(conversationData, currentUserId))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(conversationDTOs);
    }
    
    /**
     * Mark a message as read
     */
    @PutMapping("/{messageId}/read")
    public ResponseEntity<MessageDTO> markAsRead(
            @PathVariable Integer messageId,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        Integer currentUserId = currentUser.getId();
        
        logger.info("Marking message {} as read for user {}", messageId, currentUserId);
        
        Message message = messageService.markAsRead(messageId, currentUserId);
        
        return ResponseEntity.ok(messageMapper.toDTO(message, currentUserId));
    }
    
    /**
     * Mark all messages in a conversation as read
     */
    @PutMapping("/conversations/{userId}/read")
    public ResponseEntity<?> markConversationAsRead(
            @PathVariable Integer userId,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        Integer currentUserId = currentUser.getId();
        
        logger.info("Marking all messages from user {} to user {} as read", userId, currentUserId);
        
        messageService.markConversationAsRead(currentUserId, userId);
        
        return ResponseEntity.ok().build();
    }
    
    /**
     * Get count of unread messages
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadMessageCount(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        Integer currentUserId = currentUser.getId();
        
        logger.info("Fetching unread message count for user {}", currentUserId);
        
        Long unreadCount = messageService.getUnreadMessageCount(currentUserId);
        
        return ResponseEntity.ok(unreadCount);
    }
} 