import { memo, useState, useContext } from "react";
import classNames from "classnames";
import SettingIcon from "@/assets/svg/setting.svg";
import Modal from "./Modal";
import settingContext from "@/contexts/setting";

type SettingProps = {
  className: string;
};

function Setting(props: SettingProps) {
  const { className } = props;
  const [settingModalVisible, setSettingModalVisible] = useState(false);
  return (
    <>
      <div className={classNames(className)}>
        <button
          className="inline-flex items-center justify-center gap-x-1"
          onClick={() => setSettingModalVisible(true)}
        >
          <SettingIcon />
          Settings
        </button>
      </div>
      <SettingModal
        visible={settingModalVisible}
        onCloseModal={() => setSettingModalVisible(false)}
      />
    </>
  );
}

type SettingModalProps = {
  visible: boolean;
  onCloseModal: () => void;
};
function SettingModal(props: SettingModalProps) {
  const { visible, onCloseModal } = props;
  const { settings, dispatch } = useContext(settingContext);
  const [key, setKey] = useState(settings.openaiApiKey || "");
  return (
    <Modal
      visible={visible}
      onCloseModal={onCloseModal}
      onConfirm={() => dispatch({ type: "modify-apikey", payload: key })}
    >
      <label className="">
        <span className="before:content-['*'] before:text-red-500 before:mr-1">
          OpenAI API key:
        </span>
        <input
          defaultValue={settings.openaiApiKey}
          onInput={(e) => setKey((e.target as HTMLInputElement).value)}
          type="text"
          placeholder="your OpenAI API key"
          className="mt-2 p-2 block bg-[--input-background-color] w-full rounded border-none outline-none outline-2 outline-offset-0 focus:outline-[--input-outline-color] transition-[outline] duration-200"
        />
      </label>
    </Modal>
  );
}

export default memo(Setting);
