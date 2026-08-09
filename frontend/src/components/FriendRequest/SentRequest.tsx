import { useFriendStore } from "@/stores/useFriendStore";
import FriendRequestItem from "./FriendRequestItem";

const SentRequest = () => {
  const { sendList } = useFriendStore();

  if (!sendList || sendList.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bạn chưa gửi lời mời kết bạn nào.
      </p>
    );
  }
  return (
    <div className="space-y-3 mt-4">
      <>
        {sendList.map((req) => (
          <FriendRequestItem
            key={req._id}
            requestInfo={req}
            type="sent"
            actions={<p className="text-sm text-muted-foreground">Đang chờ trả lời...</p>}
          />
        ))}
      </>
    </div>
  );
};

export default SentRequest;
