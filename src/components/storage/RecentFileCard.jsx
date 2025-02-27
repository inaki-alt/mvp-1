import React from 'react'
import Dropdown from '@/components/shared/Dropdown';
import { supabase } from '@/supabaseClient';
import { toast } from 'react-toastify';

const RecentFileCard = ({ 
    imgSrc, 
    title, 
    projectLink, 
    dashboardLink, 
    category, 
    strogeOptions, 
    handleDelete, 
    id, 
    fileUrl,
    document 
}) => {
    const handleFileClick = async (e) => {
        e.preventDefault();
        
        // If we have a direct file URL, use it first
        if (fileUrl) {
            window.open(fileUrl, '_blank');
            return;
        }
        
        if (!document) {
            toast.error("File information is incomplete");
            return;
        }
        
        try {
            // Check if we have storage path in metadata
            const storagePath = document.metadata?.storage_path;
            
            if (storagePath) {
                // Get the bucket name from metadata or use default
                const bucketName = document.metadata?.bucket_name || 'documents';
                
                // Get a signed URL that works for private files
                const { data, error } = await supabase.storage
                    .from(bucketName)
                    .createSignedUrl(storagePath, 60); // URL valid for 60 seconds
                
                if (error) throw error;
                
                if (data && data.signedUrl) {
                    window.open(data.signedUrl, '_blank');
                    return;
                }
            }
            
            // Fallback to the stored URL if available
            if (document.file_url) {
                window.open(document.file_url, '_blank');
            } else {
                toast.error("Could not access file");
            }
        } catch (error) {
            console.error("Error accessing file:", error);
            
            // Fallback to the stored URL if available
            if (document.file_url) {
                window.open(document.file_url, '_blank');
            } else {
                toast.error("Failed to access file");
            }
        }
    };

    return (
        <div className="col-xxl-3 col-sm-6">
            <div className="card mb-4 stretch stretch-full">
                <div className="card-body p-0 ht-250">
                    <a 
                        href="#" 
                        className="w-100 h-100 d-flex align-items-center justify-content-center" 
                        onClick={handleFileClick}
                    >
                        <img src={imgSrc} className="img-fluid wd-80 ht-80" alt={title} />
                    </a>
                </div>
                <div className="card-footer p-4 d-flex align-items-center justify-content-between">
                    <div>
                        <h2 className="fs-13 mb-1 text-truncate-1-line">{title}</h2>
                        <small className="fs-10 text-uppercase">
                            <a href="#">{projectLink}</a> / <a href="#">{dashboardLink}</a> / <span className="text-muted">{category}</span>
                        </small>
                    </div>
                    <Dropdown 
                        dropdownItems={strogeOptions} 
                        dataBsToggle='offcanvas' 
                        id={id} 
                        onClick={handleDelete} 
                        data={document}
                    />
                </div>
            </div>
        </div>
    )
}

export default RecentFileCard
