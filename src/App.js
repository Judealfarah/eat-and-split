import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [addFriendIsOpen, setAddFriendIsOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [bill, setBill] = useState("");
  const [userAmount, setUserAmount] = useState("");
  const [friendAmount, setFriendAmount] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleAddFriendClick() {
    setAddFriendIsOpen(!addFriendIsOpen);
    setSelectedFriend(null);
    setBill("");
    setUserAmount("");
    setFriendAmount("");
    setWhoIsPaying("user");
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setBill("");
    setUserAmount("");
    setFriendAmount("");
  }

  function addFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setAddFriendIsOpen(false);
  }

  function handleSplitAmount() {
    if (!selectedFriend) return;

    const userShare = Number(userAmount);
    const friendShare = Number(friendAmount);
    let currentBalance = Number(selectedFriend.balance);

    console.log(`Initial balance: ${currentBalance}`);
    console.log(`User share: ${userShare}`);
    console.log(`Friend share: ${friendShare}`);
    console.log(`Who is paying: ${whoIsPaying}`);

    let newBalance = currentBalance;

    if (whoIsPaying === "user") {
      newBalance += friendShare;
    } else if (whoIsPaying === "friend") {
      newBalance -= userShare;
    }

    console.log(`New balance: ${newBalance}`);

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: newBalance }
          : friend
      )
    );

    setSelectedFriend(null);
    setBill("");
    setUserAmount("");
    setFriendAmount("");
    setWhoIsPaying("user");
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          handleSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {addFriendIsOpen && <AddFriendForm addFriend={addFriend} />}
        <Button onClick={handleAddFriendClick}>
          {addFriendIsOpen ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend !== null && (
        <SplitBillForm
          friend={selectedFriend}
          bill={bill}
          setBill={setBill}
          userAmount={userAmount}
          setUserAmount={setUserAmount}
          friendAmount={friendAmount}
          setFriendAmount={setFriendAmount}
          whoIsPaying={whoIsPaying}
          setWhoIsPaying={setWhoIsPaying}
          handleSplitAmount={handleSplitAmount}
        />
      )}
    </div>
  );
}

function FriendList({ friends, handleSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          handleSelectedFriend={handleSelectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSelectedFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  let textColor;
  let text;

  if (friend.balance < 0) textColor = "red";
  if (friend.balance > 0) textColor = "green";

  if (friend.balance < 0)
    text = `You owe ${friend.name} ${Math.abs(friend.balance)}$`;
  if (friend.balance > 0) text = `${friend.name} owes you ${friend.balance}$`;
  if (friend.balance === 0) text = `You and ${friend.name} are even`;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="friend"></img>
      <h3>{friend.name}</h3>
      <p className={textColor}>{text}</p>
      <Button onClick={() => handleSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function AddFriendForm({ addFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    const id = crypto.randomUUID;
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    addFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>

      <Button>Add</Button>
    </form>
  );
}

function SplitBillForm({
  friend,
  bill,
  setBill,
  userAmount,
  setUserAmount,
  friendAmount,
  setFriendAmount,
  whoIsPaying,
  setWhoIsPaying,
  handleSplitAmount,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    handleSplitAmount();
  }

  function handleYourAmount(e) {
    setUserAmount(e.target.value);
    setFriendAmount(Number(bill - e.target.value));
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split the bill with {friend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      ></input>

      <label>Your amount</label>
      <input
        type="text"
        value={userAmount}
        onChange={(e) => handleYourAmount(e)}
      ></input>

      <label>{friend.name} amount</label>
      <input type="text" value={friendAmount} disabled={true}></input>

      <label>Who paid the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
