import axios from "axios";

interface ChatInfoResult {
  id: number | string;
}

interface ChatInfoResponse {
  ok: boolean;
  result: ChatInfoResult;
}

interface MemberInfoResult {
  status: string;
}

interface MemberInfoResponse {
  ok: boolean;
  result: MemberInfoResult;
}

/**
 * Checks if a given user is subscribed to a Telegram channel (or group).
 *
 * @param url - The Telegram channel URL (e.g., "https://t.me/yourChannel")
 * @param userId - The Telegram user ID to check
 * @returns A promise that resolves to true if the user is a member, otherwise false.
 */

const token = '8029108102:AAG8QDrpfOgf7bKSYEmN5jkHmmSKbbQDg-8'; // Replace with your bot's token


export async function isUserSubscribed(url: string, userId: number): Promise<boolean> {
  try {
    // Extract the channel username from the provided URL.
    const channelUsername = url
      .replace("https://t.me/", "")
      .replace("@", "")
      .split("/")[0];

    // Get channel (or group) information using the Telegram Bot API.
    const chatInfoResponse = await axios.get<ChatInfoResponse>(
      `https://api.telegram.org/bot${token}/getChat?chat_id=@${channelUsername}`
    );
    const chatInfo = chatInfoResponse.data;

    if (!chatInfo.ok) {
      return false;
    }

    // Check if the user is a member of the channel/group.
    const memberResponse = await axios.get<MemberInfoResponse>(
      `https://api.telegram.org/bot${token}/getChatMember?chat_id=${chatInfo.result.id}&user_id=${userId}`
    );
    const memberInfo = memberResponse.data;

    if (!memberInfo.ok) {
      return false;
    }

    // Valid statuses are "creator", "administrator", or "member".
    const status = memberInfo.result.status;
    return ["creator", "administrator", "member"].includes(status);
  } catch (error: any) {
    console.error("Error checking subscription:", error.message || error);
    return false;
  }
}
