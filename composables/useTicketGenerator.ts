import { ref } from 'vue'
import type { Application, Ticket, Event } from '~/types'

export interface TicketData {
  ticket: Ticket
  event: Event
  application: Application
}

export const useTicketGenerator = () => {
  const isGenerating = ref(false)

  const generateTicketPDF = async (ticketData: TicketData): Promise<void> => {
    isGenerating.value = true

    try {
      // Dynamic import jsPDF
      const { jsPDF } = await import('jspdf')

      const { ticket, event, application } = ticketData
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Add gradient-like background
      doc.setFillColor(15, 15, 35)
      doc.rect(0, 0, 210, 297, 'F')

      // Header
      doc.setTextColor(139, 92, 246)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('EVENT TICKET', 105, 30, { align: 'center' })

      // Event Title
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.text(event.title, 105, 50, { align: 'center' })

      // Ticket Info
      doc.setFontSize(12)
      doc.setTextColor(200, 200, 200)

      const infoStartY = 70
      const lineHeight = 10

      doc.text(`Ticket ID: ${ticket.id}`, 20, infoStartY)
      doc.text(`Holder: ${ticket.holderName}`, 20, infoStartY + lineHeight)
      doc.text(`Date: ${formatDate(event.date)}`, 20, infoStartY + lineHeight * 2)
      doc.text(`Time: ${formatTime(event.date)}`, 20, infoStartY + lineHeight * 3)
      doc.text(`Location: ${event.location}`, 20, infoStartY + lineHeight * 4)
      doc.text(`Organizer: ${event.organizer}`, 20, infoStartY + lineHeight * 5)
      doc.text(`Category: ${event.category}`, 20, infoStartY + lineHeight * 6)

      // QR Code placeholder
      doc.setFillColor(255, 255, 255)
      doc.roundedRect(65, 160, 80, 80, 5, 5, 'F')

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(10)
      doc.text('Scan at entrance', 105, 250, { align: 'center' })

      // Footer
      doc.setTextColor(139, 92, 246)
      doc.setFontSize(10)
      doc.text('Powered by Tiketa', 105, 280, { align: 'center' })

      // Save PDF
      doc.save(`ticket-${ticket.id}.pdf`)

    } finally {
      isGenerating.value = false
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const copyTicketLink = async (ticketId: string): Promise<boolean> => {
    try {
      const link = `${window.location.origin}/ticket/${ticketId}`
      await navigator.clipboard.writeText(link)
      return true
    } catch (error) {
      console.error('Failed to copy link:', error)
      return false
    }
  }

  const shareTicket = async (ticketData: TicketData): Promise<boolean> => {
    const { ticket, event } = ticketData
    const shareData = {
      title: `Ticket for ${event.title}`,
      text: `Here's your ticket for ${event.title} on ${formatDate(event.date)}`,
      url: `${window.location.origin}/ticket/${ticket.id}`
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return true
      } catch (error) {
        // User cancelled or share failed
        return false
      }
    }

    // Fallback to clipboard
    return copyTicketLink(ticket.id)
  }

  return {
    isGenerating,
    generateTicketPDF,
    copyTicketLink,
    shareTicket,
    formatDate,
    formatTime
  }
}
