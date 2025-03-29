import React, { useState } from 'react';
import { Modal, Button, Form, Input, Textarea, ModalContent, ModalBody, ModalHeader, ModalFooter, addToast } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '@/api/base';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: number;
  reporterId: number;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, reportedUserId, reporterId }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ reason: '', description: '' });
  const [errors, setErrors] = useState({ reason: '' });
  const [loading, setLoading] = useState(false);

  // Validate the form; ensure "reason" is not empty.
  const validate = (): boolean => {
    let valid = true;
    const newErrors = { reason: '' };

    if (!formData.reason.trim()) {
      newErrors.reason = t("reason_required") || "Reason is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles the API request to submit the report
  const handleSubmit = async () => {
    if (!validate()) {
      addToast({
        title: t("error_text") || "Error",
        description: t("submission_failed") || "Please fix the errors in the form",
        color: "danger",
      });
      return;
    }
    setLoading(true);
    try {
      // Make the POST request using axiosInstance
      const response = await axiosInstance.post('/reports', {
        reportedUserId,   // Passing the data directly
        reporterId,       // Assuming you are passing this as well
        reason: formData.reason,
        description: formData.description,
      });
    
      // Since axios automatically parses JSON, no need for response.json()
      if (response.status === 201) {
        addToast({
          title: t("success_text") || "Success",
          description: t("report_submission_success") || "Report submitted successfully",
          color: "success",
        });
        onClose(); // Close the modal after successful submission
      } else {
        // Handle non-200 responses
        addToast({
          title: t("error_text") || "Error",
          description: response.data?.error || t("submission_failed") || "Submission failed",
          color: "danger",
        });
      }
    } catch (error) {
      // Catch errors (network issues, server errors, etc.)
      addToast({
        title: t("error_text") || "Error",
        description: error.response?.data?.message || t("submission_failed") || "Submission failed",
        color: "danger",
      });
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("report_modal_title") || "Report User"}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {t("report_modal_title") || "Report User"}
        </ModalHeader>
        <ModalBody>
          <Form className='w-full' onSubmit={handleSubmit}>
              <Input
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                fullWidth
                type="text"
                color="default"
                className="w-full"
                labelPlacement="inside"
                isRequired
                isInvalid={!!errors.reason}
                errorMessage={errors.reason}
                placeholder={`${t('enter_reason_placeholder')}`}         
              />

              <Textarea
                name="description"
                value={formData.description}
                fullWidth
                onChange={handleChange}
                placeholder={t("description_placeholder") || "Provide additional details..."}
              />
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose}>
            {t("close")}
          </Button>
          <Button isLoading={loading} color="success" onPress={handleSubmit} disabled={loading}>
            {t("submit")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;
