import { exec } from "node:child_process";
import { promisify } from "node:util";
import {
  closeMainWindow,
  environment,
  getPreferenceValues,
  showToast,
  Toast,
} from "@vicinae/api";

export const execAsync = promisify(exec);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const { editor, saveDir, saveFormat } = getPreferenceValues();

export async function runGrimblast(
  action: string,
  openEditor: boolean = false,
): Promise<void> {
  try {
    const launch = `${environment.extensionName}/${environment.commandName}`;
    closeMainWindow();
    await sleep(200);
    execAsync(
      `grimblast ${openEditor ? "edit" : "copysave"} ${action} ${saveDir}/$(date +${saveFormat})` +
      `&& vicinae 'vicinae://launch/@zspher/${launch}'`,
      { env: { ...process.env, GRIMBLAST_EDITOR: editor } },
    );
  } catch (error) {
    console.error(error);
    showToast({
      style: Toast.Style.Failure,
      title: "Action failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
