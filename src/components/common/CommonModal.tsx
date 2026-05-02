import type { ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import Button from "../input/Button";

interface CommonModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  trigger?: ReactNode;
  footer?: ReactNode;
  showDefaultFooter?: boolean;
  contentClassName?: string; // extra classes
}

export default function CommonModal({
  open,
  onOpenChange,
  children,
  trigger,
  footer,
  showDefaultFooter = false,
  contentClassName = "",
}: CommonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className={`bg-white text-black w-full sm:w-[500px] md:w-[600px] lg:w-[700px] rounded-xl shadow-xl flex flex-col overflow-hidden ${contentClassName}`}
      >
        {children}

        {footer && <DialogFooter>{footer}</DialogFooter>}
        {showDefaultFooter && !footer && (
          <DialogFooter>
            <Button
              onClick={() => onOpenChange?.(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Confirm
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}




