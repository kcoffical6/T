import React, { useState } from 'react';
import { Package, CreateBookingRequest } from '../../../../shared/src/index';

interface BookingWidgetProps {
  packageData: Package;
  onBookingComplete?: (booking: any) => void;
}

interface BookingFormData {
  packageId: string;
  pickupLocation: string;
  dropLocation: string;
  startDateTime: string;
  returnDateTime: string;
  paxCount: number;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
    country: string;
    passengers: Array<{
      name: string;
      age: number;
      passport?: string;
    }>;
  };
  specialRequests?: string;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({ packageData, onBookingComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateGuestInfo = (updates: Partial<BookingFormData['guestInfo']>) => {
    setFormData(prev => ({
      ...prev,
      guestInfo: { ...prev.guestInfo, ...updates }
    }));
  };

  const addPassenger = () => {
    setFormData(prev => ({
      ...prev,
      guestInfo: {
        ...prev.guestInfo,
        passengers: [...prev.guestInfo.passengers, { name: '', age: 0 }]
      }
    }));
  };

  const updatePassenger = (index: number, updates: Partial<{ name: string; age: number; passport?: string }>) => {
    setFormData(prev => ({
      ...prev,
      guestInfo: {
        ...prev.guestInfo,
        passengers: prev.guestInfo.passengers.map((p, i) => 
          i === index ? { ...p, ...updates } : p
        )
      }
    }));
  };

  const removePassenger = (index: number) => {
    setFormData(prev => ({
      ...prev,
      guestInfo: {
        ...prev.guestInfo,
        passengers: prev.guestInfo.passengers.filter((_, i) => i !== index)
      }
    }));
  };

  const calculateTotalPrice = () => {
    return packageData.basePricePerPax * formData.paxCount;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present and valid
      const submitData = {
        ...formData,
        packageId: packageData._id,
        paxCount: Math.max(formData.paxCount, packageData.minPax),
        guestInfo: {
          ...formData.guestInfo,
          passengers: formData.guestInfo.passengers.filter(p => p.name.trim() && p.age > 0)
        }
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const booking = await response.json();
        setBookingResult(booking);
        onBookingComplete?.(booking);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (bookingResult) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your booking request has been received and is awaiting approval from our team. 
            You will receive a confirmation email shortly.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Booking ID: <span className="font-mono font-semibold">{bookingResult._id}</span></p>
            <p className="text-sm text-gray-600">Status: <span className="text-yellow-600 font-semibold">Pending Approval</span></p>
          </div>
          <button 
            onClick={() => {
              setBookingResult(null);
              setCurrentStep(1);
            }}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Make Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-50 px-8 py-4">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step <= currentStep 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Package & Dates</span>
          <span>Passenger Details</span>
          <span>Review & Submit</span>
          <span>Confirmation</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-8">
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Package & Travel Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                <select 
                  value={formData.pickupLocation}
                  onChange={(e) => updateFormData({ pickupLocation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select pickup location</option>
                  <option value="Bangalore Airport">Bangalore Airport</option>
                  <option value="Chennai Airport">Chennai Airport</option>
                  <option value="Kochi Airport">Kochi Airport</option>
                  <option value="Hyderabad Airport">Hyderabad Airport</option>
                  <option value="Mysore Railway Station">Mysore Railway Station</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Drop Location</label>
                <input
                  type="text"
                  value={formData.dropLocation}
                  onChange={(e) => updateFormData({ dropLocation: e.target.value })}
                  placeholder="Enter drop location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDateTime}
                    onChange={(e) => updateFormData({ startDateTime: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                  <input
                    type="date"
                    value={formData.returnDateTime}
                    onChange={(e) => updateFormData({ returnDateTime: e.target.value })}
                    min={formData.startDateTime || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                <select 
                  value={formData.paxCount}
                  onChange={(e) => updateFormData({ paxCount: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {Array.from({ length: packageData.maxPax - packageData.minPax + 1 }, (_, i) => {
                    const count = packageData.minPax + i;
                    return (
                      <option key={count} value={count}>
                        {count} {count === 1 ? 'Traveler' : 'Travelers'}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.guestInfo.name}
                    onChange={(e) => updateGuestInfo({ name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.guestInfo.email}
                    onChange={(e) => updateGuestInfo({ email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.guestInfo.phone}
                    onChange={(e) => updateGuestInfo({ phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select 
                    value={formData.guestInfo.country}
                    onChange={(e) => updateGuestInfo({ country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Details</label>
                <div className="space-y-4">
                  {formData.guestInfo.passengers.map((passenger, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Passenger name"
                          value={passenger.name}
                          onChange={(e) => updatePassenger(index, { name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Age"
                          value={passenger.age || ''}
                          onChange={(e) => updatePassenger(index, { age: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePassenger(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {formData.guestInfo.passengers.length < formData.paxCount && (
                    <button
                      type="button"
                      onClick={addPassenger}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
            
            <div className="space-y-6">
              {/* Package Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Summary</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Package:</span> {packageData.title}</p>
                  <p><span className="font-medium">Duration:</span> {packageData.itinerary.length} days</p>
                  <p><span className="font-medium">Travelers:</span> {formData.paxCount}</p>
                  <p><span className="font-medium">Start Date:</span> {formData.startDateTime}</p>
                  <p><span className="font-medium">Return Date:</span> {formData.returnDateTime}</p>
                  <p><span className="font-medium">Pickup:</span> {formData.pickupLocation}</p>
                  <p><span className="font-medium">Drop:</span> {formData.dropLocation}</p>
                </div>
              </div>

              {/* Contact Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {formData.guestInfo.name}</p>
                  <p><span className="font-medium">Email:</span> {formData.guestInfo.email}</p>
                  <p><span className="font-medium">Phone:</span> {formData.guestInfo.phone}</p>
                  <p><span className="font-medium">Country:</span> {formData.guestInfo.country}</p>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-primary-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price per Person:</span>
                    <span>₹{packageData.basePricePerPax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Travelers:</span>
                    <span>{formData.paxCount}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => updateFormData({ specialRequests: e.target.value })}
                  rows={3}
                  placeholder="Any special dietary requirements, accessibility needs, or other requests..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;
