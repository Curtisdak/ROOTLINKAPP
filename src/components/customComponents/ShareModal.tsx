"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FaWhatsapp,
  FaFacebookSquare,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

interface ShareModalProps {
  url: string;
  title?: string;
}

export function ShareModal({
  url,
  title = "Partager ce lien",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    toast.success("Lien copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="gap-2 text-muted-foreground hover:text-primary cursor-pointer">
          <Share2 size={18} />
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" asChild>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </Button>

            <Button variant="outline" asChild>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookSquare className="w-5 h-5" />
              </a>
            </Button>

            <Button variant="outline" asChild>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  url
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaSquareXTwitter className="w-5 h-5" />
              </a>
            </Button>

            <Button variant="outline" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-5 h-5" />
              </a>
            </Button>

            <Button variant="outline" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <FaTiktok className="w-5 h-5" />
              </a>
            </Button>

            <Button variant="outline" asChild>
              <a
                href={`mailto:?subject=Je veux partager ceci avec toi&body=${encodeURIComponent(
                  url
                )}`}
              >
                <Mail className="w-5 h-5" />
              </a>
            </Button>
          </div>

          <div className="flex gap-2 items-center relative">
            <Input value={url} readOnly className="flex-1" />
            <CopyToClipboard text={url} onCopy={handleCopy}>
              <Button variant="ghost">
                <Copy className="w-4 h-4" />
              </Button>
            </CopyToClipboard>

            <AnimatePresence>
              {copied && (
                <motion.div
                  key="copied"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-12 text-sm text-green-600 font-medium"
                >
                  Copié ✅
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
