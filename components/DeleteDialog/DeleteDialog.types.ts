export type DeleteDialogProps<T extends HTMLElement = HTMLElement> ={
  isOpen: boolean;
  itemId: string | number;
  onConfirm: () => void;
  onCancel: () => void;
  openerRef?: React.RefObject<T>;
};
