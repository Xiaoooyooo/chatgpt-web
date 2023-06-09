import Transition from "./Transition";

type ModalProps = {
  visible: boolean;
  children: JSX.Element;
  onCloseModal: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function Modal(props: ModalProps) {
  const {
    visible,
    children,
    onCloseModal: handleCloseModal,
    onCancel: handleCancel,
    onConfirm: handleConfirm,
  } = props;
  return (
    <Transition
      visible={visible}
      beforeEnterClass="opacity-0"
      enterActiveClass="transition-opacity duration-300"
      enterDoneClass="opacity-100"
      beforeLeaveClass="opacity-100"
      leaveActiveClass="transition-opacity duration-300"
      leaveDoneClass="opacity-0"
    >
      <div className="fixed inset-0 flex items-center justify-center z-[999]">
        <div className="absolute inset-0 bg-[--modal-mask-background-color] -z-10"></div>
        <div className=" min-w-[50%] bg-[--modal-content-background-color] rounded p-10">
          {children}
          <div className="mt-8 flex justify-center gap-x-4">
            <button
              className="p-2 rounded bg-[--button-cancel-background-color] hover:bg-[--button-cancel-hover-background-color] transition-[background-color] duration-200"
              onClick={() => {
                handleCancel?.();
                handleCloseModal();
              }}
            >
              Cancel
            </button>
            <button
              className="p-2 rounded bg-[--button-confirm-background-color] hover:bg-[--button-confirm-hover-background-color] transition-[background-color] duration-200"
              onClick={() => {
                handleConfirm?.();
                handleCloseModal();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
}
