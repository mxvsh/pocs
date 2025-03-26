import { Component, ErrorInfo, ReactNode } from 'react';

type ErrorBoundaryProps = {
	children: ReactNode;
	fallback?: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
	error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
		};
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	render(): ReactNode {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className='min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900'>
					<div className='max-w-lg p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center'>
						<h2 className='text-2xl font-bold text-red-600 dark:text-red-400 mb-4'>
							Something went wrong
						</h2>
						<p className='text-gray-700 dark:text-gray-300 mb-4'>
							{this.state.error?.message || 'An unexpected error occurred'}
						</p>
						<button
							onClick={() => window.location.reload()}
							className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'
						>
							Reload the page
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
