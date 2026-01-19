import React, { useState, useEffect } from 'react';
import Modal from '../../core/ui/Modal';
import Button from '../../core/ui/button';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { showToast } from '../../core/ui/toast';
import { GET_ALL_INVENTORY } from '@/app/sudo/dashboard/stocks/inventory/page';
import { InventoryItem } from './InventoryTable';

const ADJUST_STOCK = gql`
  mutation AdjustStock($id: ID!, $adjustment: Int!) {
    adjustStock(id: $id, adjustment: $adjustment) {
      code
      success
      message
    }
  }
`;

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem | null;
  type: 'increase' | 'decrease';
}

const StockAdjustModal = ({ isOpen, onClose, inventory, type }: StockAdjustModalProps) => {
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    if (isOpen) setAmount(1);
  }, [isOpen]);

  const [adjustStock, { loading }] = useMutation(ADJUST_STOCK, {
    onCompleted: (responseData) => {
      const data = responseData as { adjustStock: { success: boolean; message: string } };
      if (data.adjustStock.success) {
        showToast(data.adjustStock.message, 'success');
        onClose();
      } else {
        showToast(data.adjustStock.message, 'error');
      }
    },
    onError: (error) => showToast(error.message, 'error'),
    refetchQueries: [{ query: GET_ALL_INVENTORY }],
  });

  const handleSubmit = async () => {
    if (!inventory) return;
    const adjustment = type === 'increase' ? amount : -amount;
    await adjustStock({ variables: { id: inventory.id, adjustment } });
  };

  const isIncrease = type === 'increase';
  const newStock = isIncrease 
    ? (inventory?.quantity || 0) + amount 
    : Math.max(0, (inventory?.quantity || 0) - amount);

  return (
    <Modal
      title={`${isIncrease ? 'Increase' : 'Decrease'} Stock`}
      description={inventory?.product?.name}
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <Button
          label={loading ? 'Saving...' : 'Save'}
          primary
          onClick={handleSubmit}
          disabled={loading || amount < 1}
        />
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Current</span>
          <span className="font-medium">{inventory?.quantity}</span>
        </div>

        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
        />

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">After</span>
          <span className={`font-medium ${isIncrease ? 'text-green-600' : 'text-orange-600'}`}>
            {newStock}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default StockAdjustModal;
