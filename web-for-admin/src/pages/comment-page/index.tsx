
import { useState } from 'react';
import { commentDto } from '../../models/commentDto'
import avatar1 from '../../assets/images/faces/1.jpg'
import avatar2 from '../../assets/images/faces/2.jpg'
import avatar3 from '../../assets/images/faces/3.jpg'
import avatar4 from '../../assets/images/faces/4.jpg'
import avatar5 from '../../assets/images/faces/5.jpg'
import avatar6 from '../../assets/images/faces/6.jpg'
import avatar7 from '../../assets/images/faces/7.jpg'
const Comments = () => {
    const [comments,setComments] = useState<commentDto[]>([
        {
            id: 1,
            name: 'Si Cantik',
            movie_id: 1,
            movie_name: "Dead Pool",
            avatar: avatar1,
            comment: 'Congratulations on your graduation!'
        },

        {
            id: 2,
            name: 'Si Ganteng',
            movie_id: 1,
            movie_name: "Dead Pool",
            avatar: avatar2,
            comment: 'Wow amazing design! Can you make another tutorial for this design?'
        },
        {
            id: 3,
            name: 'Tun Tun',
            movie_id: 2,
            movie_name: "Lord Of The Ring",
            avatar: avatar3,
            comment: 'Wow amazing design! Can you make another tutorial for this design?'
        },
        {
            id: 4,
            name: 'Nam Nam',
            movie_id: 2,
            movie_name: "Lord Of The Ring",
            avatar: avatar4,
            comment: 'Wow amazing movie'
        }

    ]);
    const [approveComments,setApproveComments] = useState<commentDto[]>([
        {
            id: 1,
            name: 'Hannal',
            movie_id: 5,
            movie_name: "VENOM: KÈO CUỐI",
            avatar: avatar5,
            comment: 'Congratulations on your graduation!'
        },

        {
            id: 2,
            name: 'Pink Pong',
            movie_id: 5,
            movie_name: "VENOM: KÈO CUỐI",
            avatar: avatar6,
            comment: 'Wow amazing design! Can you make another tutorial for this design?'
        }

    ]);
    return (
        <div>
            <header className="mb-3">
                <a href="#" className="burger-btn d-block d-xl-none">
                    <i className="bi bi-justify fs-3"></i>
                </a>
            </header>

            <div className="page-heading">
                <h3>Bình luận</h3>
            </div>

            <div className="page-content">
                <section className="row">
                    <div className="col-12 col-lg-12">
                        <div className="row">
                            <div className="col-12 col-xl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4>Bình luận cần được duyệt</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-hover table-lg">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Phim</th>
                                                        <th>Comment</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {comments.map(comment => (
                                                        <tr key={comment.id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="avatar avatar-md">
                                                                        <img src={comment.avatar} alt="Avatar" />
                                                                    </div>
                                                                    <p className="font-bold ms-3 mb-0">{comment.name}</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p className="mb-0">{comment.movie_name}</p>
                                                            </td>
                                                            <td>
                                                                <p className="mb-0">{comment.comment}</p>
                                                            </td>
                                                            <td>
                                                                <a href="#" className="btn btn-outline-success">Đồng ý</a>
                                                                <a href="#" className="btn btn-outline-danger ms-3">Từ chối</a>
                                                                <a href="#" className="btn btn-outline-info ms-3">
                                                                    <i className="fa-solid fa-share"></i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-xl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4>Danh sách bình luận</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-hover table-lg">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Phim</th>
                                                        <th>Comment</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {approveComments.map(comment => (
                                                        <tr key={comment.id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="avatar avatar-md">
                                                                        <img src={comment.avatar} alt="Avatar" />
                                                                    </div>
                                                                    <p className="font-bold ms-3 mb-0">{comment.name}</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p className="mb-0">{comment.movie_name}</p>
                                                            </td>
                                                            <td>
                                                                <p className="mb-0">{comment.comment}</p>
                                                            </td>
                                                            <td>
                                                                <a href="#" className="btn btn-outline-success">Đồng ý</a>
                                                                <a href="#" className="btn btn-outline-danger ms-3">Từ chối</a>
                                                                <a href="#" className="btn btn-outline-info ms-3">
                                                                    <i className="fa-solid fa-share"></i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Comments;
