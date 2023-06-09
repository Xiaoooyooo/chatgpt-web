import { useContext, useState } from "react";
import settingContext from "@/contexts/setting";
import Modal from "@/components/Modal";
import databaseContext from "@/contexts/database";

export default function Settings() {
  const { settings, dispatch } = useContext(settingContext);
  const [key, setKey] = useState(settings.openaiApiKey || "");
  const [clearModelVisible, setClearModalVisible] = useState(false);
  const db = useContext(databaseContext);
  async function handleClearData() {
    await db.table("conversations").deleteAll();
    await db.table("messages").deleteAll();
    // location.reload();
  }
  return (
    <>
      <div className="p-4">
        <section className="">
          <label>
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
        </section>
        <section className="mt-4">
          <label>
            <span>Model: </span>
            <input
              type="text"
              disabled
              defaultValue={settings.openaiModel}
              className="mt-2 p-2 block bg-[--input-background-color] w-full rounded"
            />
          </label>
        </section>
        <section className="mt-4">
          <span>Data: </span>
          <div className="mt-2">
            <button
              className="py-2 px-4 bg-red-600 rounded"
              onClick={() => setClearModalVisible(true)}
            >
              Clear Database
            </button>
          </div>
        </section>
        <div className="mt-8 flex justify-center gap-x-4">
          <button
            className="py-2 px-4 rounded bg-[--button-confirm-background-color] hover:bg-[--button-confirm-hover-background-color] transition-[background-color] duration-200"
            onClick={() => {
              dispatch({ type: "modify-apikey", payload: key });
            }}
          >
            Save
          </button>
        </div>
      </div>
      <Modal
        visible={clearModelVisible}
        onCloseModal={() => setClearModalVisible(false)}
        onConfirm={handleClearData}
      >
        <div>This operation cannot be undone, please proceed with caution</div>
      </Modal>
    </>
  );
}
