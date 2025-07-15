import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock conversations data
    const conversations = [
      {
        id: '1',
        name: 'Math Study Group',
        type: 'group',
        participants: [
          { id: '1', name: 'Alice Johnson', role: 'student', avatar: '/avatars/alice.jpg', isOnline: true },
          { id: '2', name: 'Bob Smith', role: 'student', avatar: '/avatars/bob.jpg', isOnline: false },
          { id: '3', name: 'Prof. Wilson', role: 'teacher', avatar: '/avatars/wilson.jpg', isOnline: true }
        ],
        lastMessage: {
          id: '1',
          senderId: '3',
          senderName: 'Prof. Wilson',
          content: 'Great work on the algebra assignment!',
          timestamp: new Date('2024-01-15T10:30:00Z'),
          type: 'text',
          status: 'read'
        },
        unreadCount: 2,
        isOnline: true,
        avatar: '/avatars/math-group.jpg'
      },
      {
        id: '2',
        name: 'Sarah Connor',
        type: 'direct',
        participants: [
          { id: '4', name: 'Sarah Connor', role: 'parent', avatar: '/avatars/sarah.jpg', isOnline: false },
          { id: 'current-user', name: 'John Doe', role: 'student', avatar: '/avatars/student.jpg', isOnline: true }
        ],
        lastMessage: {
          id: '2',
          senderId: '4',
          senderName: 'Sarah Connor',
          content: 'How was your science test today?',
          timestamp: new Date('2024-01-15T09:15:00Z'),
          type: 'text',
          status: 'delivered'
        },
        unreadCount: 1,
        isOnline: false,
        avatar: '/avatars/sarah.jpg'
      },
      {
        id: '3',
        name: 'Class 7A - Science',
        type: 'class',
        participants: [
          { id: '5', name: 'Dr. Martinez', role: 'teacher', avatar: '/avatars/martinez.jpg', isOnline: true },
          { id: '6', name: 'Emma Wilson', role: 'student', avatar: '/avatars/emma.jpg', isOnline: true },
          { id: '7', name: 'Michael Brown', role: 'student', avatar: '/avatars/michael.jpg', isOnline: false }
        ],
        lastMessage: {
          id: '3',
          senderId: '5',
          senderName: 'Dr. Martinez',
          content: 'Tomorrow we\'ll be conducting the chemistry experiment',
          timestamp: new Date('2024-01-15T08:45:00Z'),
          type: 'text',
          status: 'sent'
        },
        unreadCount: 0,
        isOnline: true,
        avatar: '/avatars/science-class.jpg'
      },
      {
        id: '4',
        name: 'Support Team',
        type: 'group',
        participants: [
          { id: '8', name: 'Support Agent', role: 'admin', avatar: '/avatars/support.jpg', isOnline: true },
          { id: 'current-user', name: 'John Doe', role: 'student', avatar: '/avatars/student.jpg', isOnline: true }
        ],
        lastMessage: {
          id: '4',
          senderId: '8',
          senderName: 'Support Agent',
          content: 'Your technical issue has been resolved',
          timestamp: new Date('2024-01-14T16:20:00Z'),
          type: 'text',
          status: 'read'
        },
        unreadCount: 0,
        isOnline: true,
        avatar: '/avatars/support.jpg'
      }
    ];

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, type, participants } = await request.json();
    
    // Create new conversation
    const newConversation = {
      id: Date.now().toString(),
      name,
      type,
      participants,
      lastMessage: undefined,
      unreadCount: 0,
      isOnline: true,
      avatar: '/avatars/default.jpg'
    };
    
    return NextResponse.json(newConversation, { status: 201 });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}