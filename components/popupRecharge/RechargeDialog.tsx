/* eslint-disable no-console */
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const RechargeDialog = ({ open, onClose, wallets, onSubmit }) => {
  const [selectedWallet, setSelectedWallet] = useState('');
  const [pin, setPin] = useState('');

  const handleWalletChange = event => {
    setSelectedWallet(event.target.value);
  };

  const handlePinChange = event => {
    setPin(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(selectedWallet, pin);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nạp tiền vào ví</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Chọn ví</InputLabel>
          <Select value={selectedWallet} onChange={handleWalletChange}>
            {wallets?.map(wallet => (
              <MenuItem key={wallet.id} value={wallet.id}>
                {wallet.walletType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField fullWidth label="Mã PIN" type="password" margin="normal" value={pin} onChange={handlePinChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} color="primary">
          Nạp tiền
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RechargeDialog;
