import { sumBy } from "lodash-es";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import CustomInputNumber from "../../components/CustomInputNumber";

const RoomAllocationContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  max-width: 375px;
  border: 1px solid #bfbfbf;
`;

const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 16px;
`;

const Text100 = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: rgb(38, 38, 38);
`;

const Text200 = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: rgb(38, 38, 38);
`;

const Text300 = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: rgb(140, 140, 140);
`;

const Text400 = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: rgb(89, 89, 89);
`;

const Divider = styled.div`
  border-top: 1px solid rgb(232, 232, 232);
`;

const GuestAllocationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StatusBox = styled.div`
  padding: 16px;
  margin: 12px 0;
  border: 1px solid rgba(30, 159, 210, 0.16);
  border-radius: 4px;
  background-color: rgb(240, 253, 255);
`;

const InfoBox = styled(StatusBox)`
  background-color: rgb(240, 253, 255);
`;

const AlertBox = styled(StatusBox)`
  background-color: rgba(254, 105, 105, 0.16);
`;

const Box = styled.div``;

const MAX_ROOM_GUEST = 4;
const INIT_ROOM_ALLOCATION = {
  adult: 1,
  child: 0,
};

const isReachedMaxGuestInRoom = (room) =>
  room.adult + room.child === MAX_ROOM_GUEST;

function RoomAllocation({ guest = 10, room = 3, onChange }) {
  const [allocationRooms, setAllocationRooms] = useState(() =>
    Array.from({ length: room }).map(() => INIT_ROOM_ALLOCATION)
  );

  const unassignedGuestCount =
    guest - sumBy(allocationRooms, (room) => room.adult + room.child);
  const isReachedMaxRoom = unassignedGuestCount === 0;

  const handleAdultAllocationChange = (event, index) => {
    const value = event.target.value;
    const updatedRooms = [...allocationRooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      adult: value,
    };
    setAllocationRooms(updatedRooms);
    onChange(updatedRooms);
  };

  const handleChildAllocationChange = (event, index) => {
    const value = event.target.value;
    const updatedRooms = [...allocationRooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      child: value,
    };
    setAllocationRooms(updatedRooms);
    onChange(updatedRooms);
  };

  if (guest < room) {
    return (
      <RoomAllocationContainer>
        <Text100>{`住客人數：${guest} 人 / ${room} 房`}</Text100>
        <AlertBox>
          <Text400>住客人數最少需等於房間數量</Text400>
        </AlertBox>
      </RoomAllocationContainer>
    );
  }

  if (guest > room * MAX_ROOM_GUEST) {
    return (
      <RoomAllocationContainer>
        <Text100>{`住客人數：${guest} 人 / ${room} 房`}</Text100>
        <AlertBox>
          <Text400>{`每間房為四人房，住客人數最多等於 ${
            room * MAX_ROOM_GUEST
          }`}</Text400>
        </AlertBox>
      </RoomAllocationContainer>
    );
  }

  return (
    <RoomAllocationContainer>
      <Text100>{`住客人數：${guest} 人 / ${room} 房`}</Text100>
      {unassignedGuestCount > 0 && (
        <InfoBox>
          <Text400>{`尚未分配人數：${unassignedGuestCount} 人`}</Text400>
        </InfoBox>
      )}
      {allocationRooms.map((room, index) => (
        <RoomContainer key={index}>
          <Text100>{`房間：${room.adult + room.child} 人`}</Text100>
          <GuestAllocationContainer>
            <Box>
              <Text200>大人</Text200>
              <Text300>年齡 20+</Text300>
            </Box>
            <CustomInputNumber
              min={1}
              max={isReachedMaxRoom ? room.adult : MAX_ROOM_GUEST - room.child}
              value={room.adult}
              disabled={isReachedMaxGuestInRoom(room) || isReachedMaxRoom}
              onChange={(event) => handleAdultAllocationChange(event, index)}
            />
          </GuestAllocationContainer>
          <GuestAllocationContainer>
            <Text200>小孩</Text200>
            <CustomInputNumber
              min={0}
              max={isReachedMaxRoom ? room.child : MAX_ROOM_GUEST - room.adult}
              value={room.child}
              disabled={isReachedMaxGuestInRoom(room) || isReachedMaxRoom}
              onChange={(event) => handleChildAllocationChange(event, index)}
            />
          </GuestAllocationContainer>
          {index !== allocationRooms.length - 1 && <Divider />}
        </RoomContainer>
      ))}
    </RoomAllocationContainer>
  );
}

export default RoomAllocation;
