import { RootState } from '@/store';

export const selectAllBuildings = (state: RootState) => state.buildings.items;
export const selectBuildingsStatus = (state: RootState) => state.buildings.status;
export const selectBuildingById = (id: number) => (state: RootState) => state.buildings.items.find((building) => building.id === id);

export const selectBuildingsPagination = (state: RootState) => ({
    currentPage: state.buildings.currentPage,
    totalPages: state.buildings.totalPages,
    totalElements: state.buildings.totalElements,
});