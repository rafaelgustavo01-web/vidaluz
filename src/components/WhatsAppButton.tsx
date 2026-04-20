import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  number?: string;
  message?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ number, message }) => {
  if (!number) return null;

  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message || '')}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[60] p-4 bg-[#25D366] text-white rounded-full shadow-[0_6px_22,5px_rgb(37,211,102,0.4)] flex items-center justify-center group"
      title="Falar no WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-bold uppercase tracking-widest">
        Consulta
      </span>
    </motion.a>
  );
};
