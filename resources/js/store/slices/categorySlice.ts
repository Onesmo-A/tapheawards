import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Nominee {
  id: string;
  name: string;
  category_id: string;
  bio?: string;
  image_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  nominees_count?: number;
  nominees?: Nominee[];
}

export interface WelcomeSettings {
  voting_active: boolean;
  voting_deadline?: string;
  show_visitor_statistics?: boolean;
  nomination_open_title?: string;
  nomination_open_dates?: string;
  timeline?: Array<{ title: string; date: string }>;
}

export interface WelcomeData {
  title: string;
  description: string;
  categories: Category[];
  settings: WelcomeSettings;
  updates?: any[];
  reels?: any[];
  testimonials?: any[];
  visitorStatistics?: any;
}

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  settings: WelcomeSettings | null;
  description: string;
  updates: any[];
  reels: any[];
  testimonials: any[];
  visitorStatistics: any;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  settings: null,
  description: '',
  updates: [],
  reels: [],
  testimonials: [],
  visitorStatistics: null,
  loading: false,
  error: null,
};

// Async thunk to fetch welcome and category data from v1 API
export const fetchWelcomeData = createAsyncThunk(
  'categories/fetchWelcomeData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<WelcomeData>('/api/v1/welcome/data');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load awards details. Please reload page.'
      );
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWelcomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWelcomeData.fulfilled, (state, action: PayloadAction<WelcomeData>) => {
        state.loading = false;
        state.categories = action.payload.categories || [];
        state.settings = action.payload.settings || null;
        state.description = action.payload.description || '';
        state.updates = action.payload.updates || [];
        state.reels = action.payload.reels || [];
        state.testimonials = action.payload.testimonials || [];
        state.visitorStatistics = action.payload.visitorStatistics || null;

        if (action.payload.categories && action.payload.categories.length > 0) {
          state.selectedCategory = action.payload.categories[0];
        }
      })
      .addCase(fetchWelcomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
