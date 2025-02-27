import React, { useState, useEffect } from 'react'
import { FiCopy, FiDownload, FiEdit2, FiInfo, FiLink2, FiMove, FiScissors, FiShare2, FiTrash2 } from 'react-icons/fi'
import RecentFileCard from './RecentFileCard';
import StrogeHeader from './StorageHeader';
import PerfectScrollbar from "react-perfect-scrollbar";
import Footer from '@/components/shared/Footer';
import { confirmDelete } from '@/utils/confirmDelete';
import StorageSidebar from './StorageSidebar';
import { supabase } from '@/supabaseClient';
import { toast } from 'react-toastify';

export const strogeOptions = [
    { icon: <FiShare2 />, label: "Share" },
    { icon: <FiInfo />, label: "Details", modalTarget: "#fileFolderDetailsOffcanvas" },
    { icon: <FiEdit2 />, label: "Rename" },
    { icon: <FiDownload />, label: "Download" },
    { type: "divider" },
    { icon: <FiCopy />, label: "Copy to..." },
    { icon: <FiMove />, label: "Move to..." },
    { icon: <FiLink2 />, label: "Open with...", link: "" },
    { type: "divider" },
    { icon: <FiScissors />, label: "Backup" },
    { icon: <FiTrash2 />, label: "Remove" },
]

const StorageContent = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Get current user
    useEffect(() => {
        const getCurrentUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error getting current user:", error);
                toast.error("Failed to authenticate user");
            } else if (user) {
                setCurrentUser(user);
            }
        };

        getCurrentUser();
    }, []);

    // Fetch documents
    useEffect(() => {
        const fetchDocuments = async () => {
            if (!currentUser) return;
            
            setIsLoading(true);
            
            try {
                // Get documents uploaded by the current user
                const { data, error } = await supabase
                    .from('documents')
                    .select(`
                        id,
                        title,
                        description,
                        file_type,
                        file_url,
                        file_name,
                        category,
                        created_at,
                        non_profit_id,
                        uploaded_by_id
                    `)
                    .eq('uploaded_by_id', currentUser.id)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                // Get documents shared with the current user
                const { data: sharedDocs, error: sharedError } = await supabase
                    .from('document_shares')
                    .select(`
                        document:document_id (
                            id,
                            title,
                            description,
                            file_type,
                            file_url,
                            file_name,
                            category,
                            created_at,
                            non_profit_id,
                            uploaded_by_id
                        )
                    `)
                    .eq('shared_with_id', currentUser.id)
                    .order('created_at', { ascending: false });
                
                if (sharedError) throw sharedError;
                
                // Combine and deduplicate documents
                const sharedDocuments = sharedDocs?.map(item => item.document) || [];
                const allDocs = [...(data || []), ...sharedDocuments];
                
                // Remove duplicates based on document ID
                const uniqueDocs = Array.from(
                    new Map(allDocs.map(doc => [doc.id, doc])).values()
                );
                
                setDocuments(uniqueDocs);
            } catch (error) {
                console.error("Error fetching documents:", error);
                toast.error("Failed to load documents");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocuments();
    }, [currentUser]);

    const handleDeleteDocument = (label, id) => {
        if (label === "Remove") {
            confirmDelete(id).then(async (result) => {
                if (result.confirmed) {
                    try {
                        // Delete from Supabase
                        const { error } = await supabase
                            .from('documents')
                            .delete()
                            .eq('id', result.id);
                        
                        if (error) throw error;
                        
                        // Update local state
                        setDocuments(documents.filter((doc) => doc.id !== result.id));
                        toast.success("Document deleted successfully");
                    } catch (error) {
                        console.error("Error deleting document:", error);
                        toast.error("Failed to delete document");
                    }
                }
            });
        }
    };

    // Get file icon based on file type
    const getFileIcon = (fileType) => {
        const defaultIcon = '/assets/images/file-icons/default.svg';
        
        if (!fileType) return defaultIcon;
        
        const fileTypeMap = {
            'pdf': '/assets/images/file-icons/pdf.svg',
            'doc': '/assets/images/file-icons/doc.svg',
            'docx': '/assets/images/file-icons/doc.svg',
            'xls': '/assets/images/file-icons/xls.svg',
            'xlsx': '/assets/images/file-icons/xls.svg',
            'ppt': '/assets/images/file-icons/ppt.svg',
            'pptx': '/assets/images/file-icons/ppt.svg',
            'jpg': '/assets/images/file-icons/jpg.svg',
            'jpeg': '/assets/images/file-icons/jpg.svg',
            'png': '/assets/images/file-icons/png.svg',
            'gif': '/assets/images/file-icons/gif.svg',
            'txt': '/assets/images/file-icons/txt.svg',
            'zip': '/assets/images/file-icons/zip.svg',
            'rar': '/assets/images/file-icons/zip.svg',
        };
        
        const extension = fileType.toLowerCase().split('/')[1];
        return fileTypeMap[extension] || defaultIcon;
    };

    return (
        <>
            <StorageSidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
            <div className='content-area'>
                <PerfectScrollbar>
                    <StrogeHeader setSidebarOpen={setSidebarOpen} />
                    <div className='content-area-body'>
                        {isLoading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="recent-section mb-5">
                                <SectionTitle
                                    sectionName={"Recent Files"}
                                    sectionDescription={"Recently accessed files"}
                                />
                                <div className="row">
                                    {documents.length === 0 ? (
                                        <div className="col-12 text-center py-5">
                                            <p className="text-muted">No documents found. Upload some files to get started.</p>
                                        </div>
                                    ) : (
                                        documents.map((doc) => (
                                            <RecentFileCard
                                                key={doc.id}
                                                imgSrc={getFileIcon(doc.file_type)}
                                                title={doc.title || doc.file_name}
                                                projectLink={doc.category || "General"}
                                                dashboardLink="Documents"
                                                category={new Date(doc.created_at).toLocaleDateString()}
                                                strogeOptions={strogeOptions}
                                                handleDelete={handleDeleteDocument}
                                                id={doc.id}
                                                fileUrl={doc.file_url}
                                                document={doc}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </PerfectScrollbar>
            </div>
        </>
    )
}

export default StorageContent


const SectionTitle = ({ sectionName, sectionDescription }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="me-4">
                <h2 className="fs-16 fw-bold mb-1">{sectionName}</h2>
                <div className="fs-12 text-muted text-truncate-1-line">{sectionDescription}</div>
            </div>
            <a href="#" className="btn btn-sm btn-light-brand">View More</a>
        </div>
    )
}


