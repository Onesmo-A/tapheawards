import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Nominee } from './categorySlice';

export interface VotePackage {
  votes: number;
  price: number;
  label: string;
  sub: string;
}

export const VOTE_PACKAGES: VotePackage[] = [
  { votes: 1, price: 500, label: '1 Vote', sub: 'Single test vote' },
  { votes: 3, price: 1000, label: '3 Votes', sub: 'Bronze Package' },
  { votes: 6, price: 5000, label: '6 Votes', sub: 'Silver Package' },
  { votes: 15, price: 10000, label: '15 Votes', sub: 'Gold Package' },
  { votes: 25, price: 20000, label: '25 Votes', sub: 'Platinum Package' },
  { votes: 55, price: 40000, label: '55 Votes', sub: 'Diamond Package' },
];

type Step = 'phone' | 'otp' | 'packages' | 'pending' | 'success' | 'failed';

interface VoteState {
  activeNominee: Nominee | null;
  step: Step;
  phone: string;
  channel: 'sms' | 'whatsapp';
  otpCode: string;
  voterToken: string;
  selectedPackage: VotePackage;
  phoneProvider: 'mpesa' | 'tigopesa' | 'airtelmoney' | 'halopesa';
  paymentPhone: string;
  orderId: string | null;
  loading: boolean;
  errorMsg: string;
}

const initialState: VoteState = {
  activeNominee: null,
  step: 'phone',
  phone: '',
  channel: 'sms',
  otpCode: '',
  voterToken: '',
  selectedPackage: VOTE_PACKAGES[0],
  phoneProvider: 'mpesa',
  paymentPhone: '',
  orderId: null,
  loading: false,
  errorMsg: '',
};

// Async thunks for the voting workflow
export const requestOtp = createAsyncThunk(
  'voting/requestOtp',
  async ({ phone, channel }: { phone: string; channel: 'sms' | 'whatsapp' }, { rejectWithValue }) => {
    try {
      await axios.post('/api/v1/vote/otp/request', { phone, channel });
      return { phone, channel };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send verification code. Try again.');
    }
  }
);

export const verifyOtpCode = createAsyncThunk(
  'voting/verifyOtp',
  async ({ phone, code }: { phone: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/vote/otp/verify', { phone, code });
      return response.data.token; // voter token
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'The verification code you entered is invalid.');
    }
  }
);

export const initiatePaidVote = createAsyncThunk(
  'voting/initiatePaidVote',
  async (
    {
      nomineeId,
      votesCount,
      phoneProvider,
      paymentPhone,
      voterToken,
    }: {
      nomineeId: string;
      votesCount: number;
      phoneProvider: string;
      paymentPhone: string;
      voterToken: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/api/v1/vote/initiate', {
        nominee_id: nomineeId,
        votes_count: votesCount,
        phone_provider: phoneProvider,
        payment_phone: paymentPhone,
        voter_token: voterToken,
      });
      return response.data.order_id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Payment checkout initialization failed. Try again.');
    }
  }
);

const voteSlice = createSlice({
  name: 'voting',
  initialState,
  reducers: {
    setActiveNominee: (state, action: PayloadAction<Nominee | null>) => {
      state.activeNominee = action.payload;
      // Reset flow state when selecting a new nominee
      if (action.payload) {
        state.step = 'phone';
        state.errorMsg = '';
        state.otpCode = '';
        state.orderId = null;
      }
    },
    setStep: (state, action: PayloadAction<Step>) => {
      state.step = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
      if (!state.paymentPhone) {
        state.paymentPhone = action.payload;
      }
    },
    setPaymentPhone: (state, action: PayloadAction<string>) => {
      state.paymentPhone = action.payload;
    },
    setChannel: (state, action: PayloadAction<'sms' | 'whatsapp'>) => {
      state.channel = action.payload;
    },
    setOtpCode: (state, action: PayloadAction<string>) => {
      state.otpCode = action.payload;
    },
    setSelectedPackage: (state, action: PayloadAction<VotePackage>) => {
      state.selectedPackage = action.payload;
    },
    setPhoneProvider: (state, action: PayloadAction<'mpesa' | 'tigopesa' | 'airtelmoney' | 'halopesa'>) => {
      state.phoneProvider = action.payload;
    },
    setErrorMsg: (state, action: PayloadAction<string>) => {
      state.errorMsg = action.payload;
    },
    resetVoteFlow: (state) => {
      state.activeNominee = null;
      state.step = 'phone';
      state.phone = '';
      state.paymentPhone = '';
      state.otpCode = '';
      state.voterToken = '';
      state.orderId = null;
      state.errorMsg = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Request OTP
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.errorMsg = '';
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.phone = action.payload.phone;
        state.channel = action.payload.channel;
        state.step = 'otp';
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOtpCode.pending, (state) => {
        state.loading = true;
        state.errorMsg = '';
      })
      .addCase(verifyOtpCode.fulfilled, (state, action) => {
        state.loading = false;
        state.voterToken = action.payload;
        state.step = 'packages';
      })
      .addCase(verifyOtpCode.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload as string;
      })
      // Initiate Payment
      .addCase(initiatePaidVote.pending, (state) => {
        state.loading = true;
        state.errorMsg = '';
      })
      .addCase(initiatePaidVote.fulfilled, (state, action) => {
        state.loading = false;
        state.orderId = action.payload;
        state.step = 'pending';
      })
      .addCase(initiatePaidVote.rejected, (state, action) => {
        state.loading = false;
        state.errorMsg = action.payload as string;
      });
  },
});

export const {
  setActiveNominee,
  setStep,
  setPhone,
  setPaymentPhone,
  setChannel,
  setOtpCode,
  setSelectedPackage,
  setPhoneProvider,
  setErrorMsg,
  resetVoteFlow,
} = voteSlice.actions;

export default voteSlice.reducer;
