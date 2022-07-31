import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Button = styled.button`
  width: 48px;
  height: 48px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: white;
  border-radius: 4px;
  font-size: 24px;
  font-weight: 500;
  border: 1px solid rgb(30, 159, 210);
  color: rgb(30, 159, 210);

  &:disabled {
    opacity: 0.48;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    background-color: rgb(240, 253, 255);
  }
  &:not(:disabled):active {
    background-color: rgb(199, 247, 255);
  }
  &:not(:disabled):focus {
    outline: none;
    box-shadow: rgb(30 159 210 / 48%) 0px 0px 0px 2px;
  }
`;

const CustomInputNumberContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const NumberInput = styled.input`
  width: 48px;
  height: 48px;
  text-align: center;
  font-weight: normal;
  font-size: 14px;
  color: rgb(89, 89, 89);
  opacity: 1;
  box-sizing: border-box;
  border: 1px solid rgb(191, 191, 191);
  border-radius: 4px;

  &:focus {
    outline: none;
  }
`;

const INTERVAL_MS = 100;

const useCustomerInput = ({
  min,
  max,
  step,
  name,
  defaultValue,
  disabled,
  onBlur,
  onChange,
}) => {
  const [value, setValue] = useState(defaultValue || min);
  const countRef = useRef(value);
  const [decrementTimer, setDecrementTimer] = useState(null);
  const [incrementTimer, setIncrementTimer] = useState(null);

  countRef.current = value;

  const decrementDisabled = value <= min;
  const incrementDisabled = value >= max;

  const handleChange = (event) => {
    if (disabled) return;
    const inputValue = event.target.value;
    const numberValue = Number(event.target.value);
    if (inputValue !== "" && Number.isInteger(numberValue)) {
      if (numberValue < min || numberValue > max) return;
      setValue(numberValue);
      onChange({ name, target: { value: numberValue } });
    }
  };

  const handleKeepDecrement = () => {
    handleStopDecrement();
    setDecrementTimer(
      setInterval(() => {
        handleDecrement();
      }, INTERVAL_MS)
    );
  };

  const handleStopDecrement = () => {
    if (decrementTimer) {
      clearInterval(decrementTimer);
    }
  };

  const handleDecrement = () => {
    if (decrementDisabled) return;
    setValue((prev) => prev - 1);
    onChange({ name, target: { value: countRef.current } });
  };

  useEffect(() => {
    if (decrementDisabled) clearInterval(decrementTimer);
  }, [decrementDisabled, decrementTimer]);

  const handleKeepIncrement = () => {
    handleStopIncrement();
    setIncrementTimer(
      setInterval(() => {
        handleIncrement();
      }, INTERVAL_MS)
    );
  };

  const handleStopIncrement = () => {
    if (incrementTimer) {
      clearInterval(incrementTimer);
    }
  };

  const handleIncrement = () => {
    if (incrementDisabled) return;
    setValue((prev) => prev + 1);
    onChange({ name, target: { value: countRef.current } });
  };

  useEffect(() => {
    if (incrementDisabled) clearInterval(incrementTimer);
  }, [incrementDisabled, incrementTimer]);

  return {
    inputProps: {
      type: "number",
      inputmode: "numeric",
      min,
      max,
      step,
      value,
      disabled,
      onBlur,
      onChange: handleChange,
    },
    decrementProps: {
      disabled: decrementDisabled,
      onClick: handleDecrement,
      onPointerDown: handleKeepDecrement,
      onPointerUp: handleStopDecrement,
    },
    incrementProps: {
      disabled: incrementDisabled,
      onClick: handleIncrement,
      onPointerDown: handleKeepIncrement,
      onPointerUp: handleStopIncrement,
    },
  };
};

function CustomInputNumber({
  min = 0,
  max = 10,
  step = 1,
  name = "CustomInputNumber",
  value: defaultValue = 0,
  disabled = false,
  onChange,
  onBlur,
}) {
  const { inputProps, decrementProps, incrementProps } = useCustomerInput({
    min,
    max,
    step,
    name,
    disabled,
    defaultValue,
    onBlur,
    onChange,
  });

  return (
    <CustomInputNumberContainer>
      <Button {...decrementProps}>-</Button>
      <label htmlFor="input">
        <NumberInput {...inputProps} />
      </label>
      <Button {...incrementProps}>+</Button>
    </CustomInputNumberContainer>
  );
}

export default CustomInputNumber;
