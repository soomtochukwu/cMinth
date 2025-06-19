import React from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";

const WalletConnectButton = () => {
  return (
    <ConnectButton
      chainStatus="icon"
      accountStatus="address"
      showBalance={{
        smallScreen: true,
        largeScreen: true,
      }}
    />
  );
};

export default WalletConnectButton;
