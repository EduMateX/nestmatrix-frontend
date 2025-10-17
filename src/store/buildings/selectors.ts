import { RootState } from '@/store';
import { createSelector } from '@reduxjs/toolkit';

export const selectAllBuildings = (state: RootState) => state.buildings.items;
export const selectBuildingsStatus = (state: RootState) => state.buildings.status;
export const selectBuildingById = (id: number) => (state: RootState) => state.buildings.items.find((building) => building.id === id);

export const selectBuildingsPagination = createSelector(
    (state: RootState) => state.buildings.currentPage,
    (state: RootState) => state.buildings.totalPages,
    (state: RootState) => state.buildings.totalElements,
    (currentPage, totalPages, totalElements) => ({
        currentPage,
        totalPages,
        totalElements,
    })
);