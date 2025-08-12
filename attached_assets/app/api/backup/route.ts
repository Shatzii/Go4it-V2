import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { createDatabaseBackup, listBackups, restoreFromBackup } from '@/lib/backup'
import { logAuditEvent, getClientIP } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, backupId } = body

    switch (action) {
      case 'create':
        const metadata = await createDatabaseBackup()
        
        logAuditEvent({
          userId: user.userId,
          action: 'backup_created',
          resource: 'system',
          ip: getClientIP(request),
          userAgent: request.headers.get('user-agent') || '',
          success: metadata.status === 'completed',
          details: { backupId: metadata.id, status: metadata.status }
        })

        return NextResponse.json({
          success: true,
          backup: metadata
        })

      case 'restore':
        if (!backupId) {
          return NextResponse.json(
            { error: 'Backup ID required for restore' },
            { status: 400 }
          )
        }

        const restored = await restoreFromBackup(backupId)
        
        logAuditEvent({
          userId: user.userId,
          action: 'backup_restored',
          resource: 'system',
          ip: getClientIP(request),
          userAgent: request.headers.get('user-agent') || '',
          success: restored,
          details: { backupId }
        })

        return NextResponse.json({
          success: restored,
          message: restored ? 'Database restored successfully' : 'Restore failed'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Backup operation error:', error)
    return NextResponse.json(
      { error: 'Backup operation failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const backups = await listBackups()

    return NextResponse.json({
      success: true,
      backups
    })

  } catch (error) {
    console.error('List backups error:', error)
    return NextResponse.json(
      { error: 'Failed to list backups' },
      { status: 500 }
    )
  }
}