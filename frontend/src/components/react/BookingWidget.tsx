import React, { useState } from 'react'

import type { Package } from '../../../../shared/src/index'

interface BookingWidgetProps {
    packageData: Package
    onBookingComplete?: (booking: any) => void
}

interface BookingFormData {
    packageId: string
    pickupLocation: string
    dropLocation: string
    startDateTime: string
    returnDateTime: string
    paxCount: number
    guestInfo: {
        name: string
        email: string
        phone: string
        country: string
        passengers: Array<{
            name: string
            age: number
            passport?: string
        }>
    }
    specialRequests?: string
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ packageData, onBookingComplete }) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<BookingFormData>({
        packageId: packageData._id,
        pickupLocation: '',
        dropLocation: '',
        startDateTime: '',
        returnDateTime: '',
        paxCount: packageData.minPax,
        guestInfo: {
            name: '',
            email: '',
            phone: '',
            country: '',
            passengers: []
        },
        specialRequests: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bookingResult, setBookingResult] = useState<any>(null)

    const updateFormData = (updates: Partial<BookingFormData>) => {
        setFormData((prev) => ({ ...prev, ...updates }))
    }

    const updateGuestInfo = (updates: Partial<BookingFormData['guestInfo']>) => {
        setFormData((prev) => ({
            ...prev,
            guestInfo: { ...prev.guestInfo, ...updates }
        }))
    }

    const addPassenger = () => {
        setFormData((prev) => ({
            ...prev,
            guestInfo: {
                ...prev.guestInfo,
                passengers: [...prev.guestInfo.passengers, { name: '', age: 0 }]
            }
        }))
    }

    const updatePassenger = (index: number, updates: Partial<{ name: string; age: number; passport?: string }>) => {
        setFormData((prev) => ({
            ...prev,
            guestInfo: {
                ...prev.guestInfo,
                passengers: prev.guestInfo.passengers.map((p, i) => (i === index ? { ...p, ...updates } : p))
            }
        }))
    }

    const removePassenger = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            guestInfo: {
                ...prev.guestInfo,
                passengers: prev.guestInfo.passengers.filter((_, i) => i !== index)
            }
        }))
    }

    const calculateTotalPrice = () => {
        return packageData.basePricePerPax * formData.paxCount
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            // Ensure all required fields are present and valid
            const submitData = {
                ...formData,
                packageId: packageData._id,
                paxCount: Math.max(formData.paxCount, packageData.minPax),
                guestInfo: {
                    ...formData.guestInfo,
                    passengers: formData.guestInfo.passengers.filter((p) => p.name.trim() && p.age > 0)
                }
            }

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            })

            if (response.ok) {
                const booking = await response.json()
                setBookingResult(booking)
                onBookingComplete?.(booking)
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
                throw new Error(errorData.error || 'Booking failed')
            }
        } catch (error) {
            console.error('Booking error:', error)
            alert(`Booking failed: ${error instanceof Error ? error.message : 'Please try again.'}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    if (bookingResult) {
        return (
            <div className='mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg'>
                <div className='text-center'>
                    <div className='mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100'>
                        <svg className='size-8 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M5 13l4 4L19 7'
                            ></path>
                        </svg>
                    </div>
                    <h2 className='mb-4 text-2xl font-bold text-gray-900'>Booking Request Submitted!</h2>
                    <p className='mb-6 text-gray-600'>
                        Your booking request has been received and is awaiting approval from our team. You will receive
                        a confirmation email shortly.
                    </p>
                    <div className='mb-6 rounded-lg bg-gray-50 p-4'>
                        <p className='text-sm text-gray-600'>
                            Booking ID: <span className='font-mono font-semibold'>{bookingResult._id}</span>
                        </p>
                        <p className='text-sm text-gray-600'>
                            Status: <span className='font-semibold text-yellow-600'>Pending Approval</span>
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setBookingResult(null)
                            setCurrentStep(1)
                        }}
                        className='rounded-lg bg-primary-600 px-6 py-2 text-white transition-colors hover:bg-primary-700'
                    >
                        Make Another Booking
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white shadow-lg'>
            {/* Progress Bar */}
            <div className='bg-gray-50 px-8 py-4'>
                <div className='flex items-center justify-between'>
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className='flex items-center'>
                            <div
                                className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold ${
                                    step <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                                }`}
                            >
                                {step}
                            </div>
                            {step < 4 && (
                                <div
                                    className={`mx-2 h-1 w-16 ${step < currentStep ? 'bg-primary-600' : 'bg-gray-300'}`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className='mt-2 flex justify-between text-xs text-gray-600'>
                    <span>Package & Dates</span>
                    <span>Passenger Details</span>
                    <span>Review & Submit</span>
                    <span>Confirmation</span>
                </div>
            </div>

            {/* Step Content */}
            <div className='p-8'>
                {currentStep === 1 && (
                    <div>
                        <h2 className='mb-6 text-2xl font-bold text-gray-900'>Package & Travel Details</h2>

                        <div className='space-y-6'>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>Pickup Location</label>
                                <select
                                    value={formData.pickupLocation}
                                    onChange={(e) => updateFormData({ pickupLocation: e.target.value })}
                                    className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                >
                                    <option value=''>Select pickup location</option>
                                    <option value='Bangalore Airport'>Bangalore Airport</option>
                                    <option value='Chennai Airport'>Chennai Airport</option>
                                    <option value='Kochi Airport'>Kochi Airport</option>
                                    <option value='Hyderabad Airport'>Hyderabad Airport</option>
                                    <option value='Mysore Railway Station'>Mysore Railway Station</option>
                                </select>
                            </div>

                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>Drop Location</label>
                                <input
                                    type='text'
                                    value={formData.dropLocation}
                                    onChange={(e) => updateFormData({ dropLocation: e.target.value })}
                                    placeholder='Enter drop location'
                                    className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                />
                            </div>

                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <div>
                                    <label className='mb-2 block text-sm font-medium text-gray-700'>Start Date</label>
                                    <input
                                        type='date'
                                        value={formData.startDateTime}
                                        onChange={(e) => updateFormData({ startDateTime: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                    />
                                </div>
                                <div>
                                    <label className='mb-2 block text-sm font-medium text-gray-700'>Return Date</label>
                                    <input
                                        type='date'
                                        value={formData.returnDateTime}
                                        onChange={(e) => updateFormData({ returnDateTime: e.target.value })}
                                        min={formData.startDateTime || new Date().toISOString().split('T')[0]}
                                        className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>
                                    Number of Travelers
                                </label>
                                <select
                                    value={formData.paxCount}
                                    onChange={(e) => updateFormData({ paxCount: parseInt(e.target.value) })}
                                    className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                >
                                    {Array.from({ length: packageData.maxPax - packageData.minPax + 1 }, (_, i) => {
                                        const count = packageData.minPax + i
                                        return (
                                            <option key={count} value={count}>
                                                {count} {count === 1 ? 'Traveler' : 'Travelers'}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div>
                        <h2 className='mb-6 text-2xl font-bold text-gray-900'>Contact Information</h2>

                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <div>
                                    <label className='mb-2 block text-sm font-medium text-gray-700'>Full Name</label>
                                    <input
                                        type='text'
                                        value={formData.guestInfo.name}
                                        onChange={(e) => updateGuestInfo({ name: e.target.value })}
                                        className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='mb-2 block text-sm font-medium text-gray-700'>Email</label>
                                    <input
                                        type='email'
                                        value={formData.guestInfo.email}
                                        onChange={(e) => updateGuestInfo({ email: e.target.value })}
                                        className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <div>
                                    <label className='mb-2 block text-sm font-medium text-gray-700'>Phone Number</label>
                                    <input
                                        type='tel'
                                        value={formData.guestInfo.phone}
                                        onChange={(e) => updateGuestInfo({ phone: e.target.value })}
                                        className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='mb-2 block text-sm font-medium text-gray-700'>Country</label>
                                    <select
                                        value={formData.guestInfo.country}
                                        onChange={(e) => updateGuestInfo({ country: e.target.value })}
                                        className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                        required
                                    >
                                        <option value=''>Select your country</option>
                                        <option value='US'>United States</option>
                                        <option value='UK'>United Kingdom</option>
                                        <option value='CA'>Canada</option>
                                        <option value='AU'>Australia</option>
                                        <option value='DE'>Germany</option>
                                        <option value='FR'>France</option>
                                        <option value='other'>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>
                                    Passenger Details
                                </label>
                                <div className='space-y-4'>
                                    {formData.guestInfo.passengers.map((passenger, index) => (
                                        <div
                                            key={index}
                                            className='flex items-center space-x-4 rounded-lg bg-gray-50 p-4'
                                        >
                                            <div className='flex-1'>
                                                <input
                                                    type='text'
                                                    placeholder='Passenger name'
                                                    value={passenger.name}
                                                    onChange={(e) => updatePassenger(index, { name: e.target.value })}
                                                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                                />
                                            </div>
                                            <div className='w-24'>
                                                <input
                                                    type='number'
                                                    placeholder='Age'
                                                    value={passenger.age || ''}
                                                    onChange={(e) =>
                                                        updatePassenger(index, { age: parseInt(e.target.value) || 0 })
                                                    }
                                                    className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                                />
                                            </div>
                                            <button
                                                type='button'
                                                onClick={() => removePassenger(index)}
                                                className='text-red-600 hover:text-red-700'
                                            >
                                                <svg
                                                    className='size-5'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth='2'
                                                        d='M6 18L18 6M6 6l12 12'
                                                    ></path>
                                                </svg>
                                            </button>
                                        </div>
                                    ))}

                                    {formData.guestInfo.passengers.length < formData.paxCount && (
                                        <button
                                            type='button'
                                            onClick={addPassenger}
                                            className='w-full rounded-lg border-2 border-dashed border-gray-300 py-2 text-gray-600 transition-colors hover:border-primary-500 hover:text-primary-600'
                                        >
                                            + Add Passenger
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div>
                        <h2 className='mb-6 text-2xl font-bold text-gray-900'>Review & Submit</h2>

                        <div className='space-y-6'>
                            {/* Package Summary */}
                            <div className='rounded-lg bg-gray-50 p-6'>
                                <h3 className='mb-4 text-lg font-semibold text-gray-900'>Package Summary</h3>
                                <div className='space-y-2'>
                                    <p>
                                        <span className='font-medium'>Package:</span> {packageData.title}
                                    </p>
                                    <p>
                                        <span className='font-medium'>Duration:</span> {packageData.itinerary.length}{' '}
                                        days
                                    </p>
                                    <p>
                                        <span className='font-medium'>Travelers:</span> {formData.paxCount}
                                    </p>
                                    <p>
                                        <span className='font-medium'>Start Date:</span> {formData.startDateTime}
                                    </p>
                                    <p>
                                        <span className='font-medium'>Return Date:</span> {formData.returnDateTime}
                                    </p>
                                    <p>
                                        <span className='font-medium'>Pickup:</span> {formData.pickupLocation}
                                    </p>
                                    <p>
                                        <span className='font-medium'>Drop:</span> {formData.dropLocation}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Summary */}
                            <div className='rounded-lg bg-gray-50 p-6'>
                                <h3 className='mb-4 text-lg font-semibold text-gray-900'>Contact Information</h3>
                                <div className='space-y-2'>
                                    <p>
                                        <span className='font-medium'>Name:</span> {formData.guestInfo.name}
                                    </p>
                                    <p>
                                        <span className='font-medium'>Email:</span> {formData.guestInfo.email}
                                    </p>
                                    <p>
                                        <span className='font-medium'>Phone:</span> {formData.guestInfo.phone}
                                    </p>
                                    <p>
                                        <span className='font-medium'>Country:</span> {formData.guestInfo.country}
                                    </p>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className='rounded-lg bg-primary-50 p-6'>
                                <h3 className='mb-4 text-lg font-semibold text-gray-900'>Price Summary</h3>
                                <div className='space-y-2'>
                                    <div className='flex justify-between'>
                                        <span>Base Price per Person:</span>
                                        <span>₹{packageData.basePricePerPax.toLocaleString()}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span>Number of Travelers:</span>
                                        <span>{formData.paxCount}</span>
                                    </div>
                                    <div className='flex justify-between border-t pt-2 text-lg font-semibold'>
                                        <span>Total Amount:</span>
                                        <span>₹{calculateTotalPrice().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>
                                    Special Requests (Optional)
                                </label>
                                <textarea
                                    value={formData.specialRequests}
                                    onChange={(e) => updateFormData({ specialRequests: e.target.value })}
                                    rows={3}
                                    placeholder='Any special dietary requirements, accessibility needs, or other requests...'
                                    className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-primary-500'
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className='mt-8 flex justify-between'>
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className='rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        Previous
                    </button>

                    {currentStep < 3 ? (
                        <button
                            onClick={nextStep}
                            className='rounded-lg bg-primary-600 px-6 py-2 text-white transition-colors hover:bg-primary-700'
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className='rounded-lg bg-primary-600 px-6 py-2 text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BookingWidget
