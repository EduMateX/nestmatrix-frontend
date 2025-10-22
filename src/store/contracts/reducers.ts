import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractsState, Contract } from './types';
import {
    fetchContracts,
    fetchContractById,
    createContract,
    uploadContractFile,
    terminateContract,
    sendForSigning,
    approveSignature,
    requestTermination,
    signDigitally,
    confirmTermination
} from './actions';
import { logoutAction } from '../auth';

const initialState: ContractsState = {
    items: [],
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    status: 'idle',
    error: null,
};

const updateOrAddContractInState = (state: ContractsState, action: PayloadAction<Contract>) => {
    const updatedContract = action.payload;
    const index = state.items.findIndex(item => item.id === updatedContract.id);
    if (index !== -1) {
        state.items[index] = updatedContract;
    } else {
        state.items.unshift(updatedContract);
    }
    state.status = 'succeeded';
};

const setLoadingState = (state: ContractsState) => {
    state.status = 'loading';
    state.error = null;
}

const setFailedState = (state: ContractsState, action: any) => {
    state.status = 'failed';
    state.error = action.payload as string;
}

const contractsSlice = createSlice({
    name: 'contracts',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // --- TẤT CẢ .addCase PHẢI ĐƯỢC ĐẶT Ở ĐÂY ---
            .addCase(fetchContracts.pending, setLoadingState)
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.currentPage = action.payload.number;
                state.totalPages = action.payload.totalPages;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchContracts.rejected, setFailedState)

            .addCase(createContract.fulfilled, (state) => { state.status = 'idle'; })
            .addCase(createContract.pending, setLoadingState)
            .addCase(createContract.rejected, setFailedState)

            .addCase(fetchContractById.fulfilled, updateOrAddContractInState)
            .addCase(uploadContractFile.fulfilled, updateOrAddContractInState)
            .addCase(terminateContract.fulfilled, updateOrAddContractInState)
            .addCase(sendForSigning.fulfilled, updateOrAddContractInState)
            .addCase(approveSignature.fulfilled, updateOrAddContractInState)
            .addCase(requestTermination.fulfilled, updateOrAddContractInState)
            .addCase(signDigitally.fulfilled, updateOrAddContractInState)
            .addCase(confirmTermination.fulfilled, updateOrAddContractInState)

            .addCase(logoutAction.fulfilled, () => initialState)

            .addMatcher(
                (action) => [
                    fetchContractById.pending,
                    uploadContractFile.pending,
                    terminateContract.pending,
                    sendForSigning.pending,
                    approveSignature.pending,
                    requestTermination.pending,
                    signDigitally.pending,
                    confirmTermination.pending,
                ].includes(action.type),
                setLoadingState
            )
            .addMatcher(
                (action) => [
                    fetchContractById.rejected,
                    uploadContractFile.rejected,
                    terminateContract.rejected,
                    sendForSigning.rejected,
                    approveSignature.rejected,
                    requestTermination.rejected,
                    signDigitally.rejected,
                    confirmTermination.rejected,
                ].includes(action.type),
                setFailedState
            );
    },
});

export const { resetStatus } = contractsSlice.actions;
export default contractsSlice.reducer;