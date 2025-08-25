<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import InputError from '@/Components/InputError.vue';
import Stepper from '@/Components/Stepper.vue';

const props = defineProps({
    selectedCategory: {
        type: Object,
        required: true,
    },
    nomination_fee: {
        type: Number,
        required: true,
    },
    title: String,
});

const applicationSteps = [
    'Select Category',
    'Application Form',
    'Review & Status',
];

const form = useForm({
    category_id: props.selectedCategory.id,
    applicant_name: '',
    applicant_phone: '',
    applicant_email: '',
    bio: '',
    photo: null,
});

const onFileChange = (event) => {
    form.photo = event.target.files[0];
};

const submit = () => {
    form.post(route('user.applications.store'), {
        onError: () => {
            // Handle error, maybe scroll to first error
        },
    });
};
</script>

<template>
    <Head :title="title" />

    <AuthenticatedLayout>
<template #header>
    <h2 class="font-semibold text-xl text-gray-200 leading-tight">
        {{ title }}
    </h2>
</template>


        <div class="py-12">
            <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
                <div class="mb-8">
                    <Stepper :steps="applicationSteps" :current-step="2" />
                </div>

                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <form @submit.prevent="submit" class="p-6 md:p-8 space-y-6">
                        <!-- Selected Category Display (Replaces Dropdown) -->
                        <div>
                            <InputLabel for="category" value="Category" />
                            <div id="category" class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-700">
                                {{ selectedCategory.name }}
                            </div>
                            <InputError class="mt-2" :message="form.errors.category_id" />
                        </div>

                        <!-- Applicant Name -->
                        <div>
                            <InputLabel for="applicant_name" value="Applicant/Business Name" />
                            <TextInput
                                id="applicant_name"
                                type="text"
                                class="mt-1 block w-full"
                                v-model="form.applicant_name"
                                required
                                autofocus
                                autocomplete="name"
                            />
                            <InputError class="mt-2" :message="form.errors.applicant_name" />
                        </div>

                        <!-- Applicant Phone -->
                        <div>
                            <InputLabel for="applicant_phone" value="Phone Number (e.g., 0712345678)" />
                            <TextInput
                                id="applicant_phone"
                                type="tel"
                                class="mt-1 block w-full"
                                v-model="form.applicant_phone"
                                required
                                autocomplete="tel"
                            />
                            <InputError class="mt-2" :message="form.errors.applicant_phone" />
                        </div>

                        <!-- Applicant Email -->
                        <div>
                            <InputLabel for="applicant_email" value="Email Address" />
                            <TextInput
                                id="applicant_email"
                                type="email"
                                class="mt-1 block w-full"
                                v-model="form.applicant_email"
                                required
                                autocomplete="email"
                            />
                            <InputError class="mt-2" :message="form.errors.applicant_email" />
                        </div>

                        <!-- Bio -->
                        <div>
                            <InputLabel for="bio" value="Biography / Profile" />
                            <p class="text-sm text-gray-500 mb-2">
                                Provide a detailed profile of the nominee or business. (Min 50, Max 2000 characters)
                            </p>
                            <textarea
                                id="bio"
                                class="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                v-model="form.bio"
                                rows="8"
                                required
                            ></textarea>
                            <InputError class="mt-2" :message="form.errors.bio" />
                        </div>

                        <!-- Photo -->
                        <div>
                            <InputLabel for="photo" value="Nominee Photo / Business Logo" />
                            <input
                                id="photo"
                                type="file"
                                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                @change="onFileChange"
                                required
                                accept="image/png, image/jpeg, image/jpg, image/gif"
                            />
                            <InputError class="mt-2" :message="form.errors.photo" />
                        </div>

                        <!-- Nomination Fee Info -->
                        <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <h4 class="font-semibold text-gray-800">Nomination Fee</h4>
                            <p class="text-sm text-gray-600">
                                A non-refundable nomination fee of
                                <strong class="font-bold">TZS {{ new Intl.NumberFormat().format(nomination_fee) }}</strong>
                                is required to complete this application. Payment instructions will be provided after submission.
                            </p>
                        </div>

                        <!-- Submit Button -->
                        <div class="flex items-center justify-end">
                            <PrimaryButton :class="{ 'opacity-25': form.processing }" :disabled="form.processing">
                                Submit Application
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>